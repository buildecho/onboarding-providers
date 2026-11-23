data "aws_partition" "current" {}

locals {
  partition  = data.aws_partition.current.partition
  account_id = data.aws_caller_identity.current.account_id
  region     = data.aws_region.current.region

  create_template = var.create && var.create_repository_creation_template
  use_kms         = var.encryption_type == "KMS"

  create_kms_key = local.create_template && local.use_kms && var.create_kms_key
  kms_key_arn    = local.create_template && local.use_kms ? (var.create_kms_key ? one(aws_kms_key.this[*].arn) : var.kms_key_arn) : null

  kms_key_arn_region  = var.kms_key_arn == null ? null : split(":", var.kms_key_arn)[3]
  kms_key_arn_account = var.kms_key_arn == null ? null : split(":", var.kms_key_arn)[4]

  # ECR requires customRoleArn whenever the template uses KMS or resource tags.
  needs_creation_role  = local.create_template && (local.use_kms || length(var.repository_tags) > 0)
  create_creation_role = local.needs_creation_role && var.creation_role_arn == null
  creation_role_arn = local.needs_creation_role ? (
    local.create_creation_role ? "arn:${local.partition}:iam::${local.account_id}:role/${var.creation_role_name}" : var.creation_role_arn
  ) : null

  cache_repository_arn_pattern = "arn:${local.partition}:ecr:${local.region}:${local.account_id}:repository/${var.cache_namespace}/*"

  template_options_set = (
    var.encryption_type != "AES256" ||
    var.kms_key_arn != null ||
    var.create_kms_key ||
    var.creation_role_arn != null ||
    var.image_tag_mutability != "MUTABLE" ||
    var.lifecycle_policy != null ||
    var.repository_policy != null ||
    length(var.repository_tags) > 0
  )

  # Cross-input checks. Raised from outputs.tf (not via precondition blocks) so the
  # module keeps working on Terraform >= 1.0.
  input_errors = compact([
    !var.create || var.create_repository_creation_template || !local.template_options_set ? "" : "Repository creation template inputs (encryption_type, kms_key_arn, create_kms_key, creation_role_arn, image_tag_mutability, lifecycle_policy, repository_policy, repository_tags) only take effect with create_repository_creation_template = true. Set it to true, or remove those inputs.",
    !local.use_kms || (var.kms_key_arn != null) != var.create_kms_key ? "" : "encryption_type = \"KMS\" requires exactly one of: kms_key_arn = \"arn:aws:kms:<region>:<account>:key/<id>\" (existing key, same or other account), or create_kms_key = true (module creates a key in this account).",
    local.use_kms || (var.kms_key_arn == null && !var.create_kms_key) ? "" : "kms_key_arn / create_kms_key are only used with encryption_type = \"KMS\". Set encryption_type = \"KMS\" or remove them.",
    var.kms_key_arn == null || local.kms_key_arn_region == local.region ? "" : "kms_key_arn is in Region ${coalesce(local.kms_key_arn_region, "-")} but this ECR registry is in ${local.region}. ECR requires the KMS key to be in the same Region as the repositories (it may be in a different account).",
  ])
  inputs_valid = length(local.input_errors) == 0 ? true : tobool("echo-terraform-ecr-mirror input error: ${join(" | ", local.input_errors)}")
}

# ECR Pullthrough Cache Rule
resource "aws_ecr_pull_through_cache_rule" "this" {
  count = var.create ? 1 : 0

  ecr_repository_prefix = var.cache_namespace
  upstream_registry_url = "${var.echo_registry_account_id}.dkr.ecr.${var.echo_registry_region}.amazonaws.com"

  custom_role_arn = var.create ? aws_iam_role.ecr_access[0].arn : null

  depends_on = [aws_iam_role.ecr_access]

}

# IAM Role for ECR access
resource "aws_iam_role" "ecr_access" {
  count = var.create ? 1 : 0

  name = var.role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "pullthroughcache.ecr.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = var.tags
}

# IAM Policy for ECR access
resource "aws_iam_role_policy" "ecr_pullthrough_cache" {
  count = var.create ? 1 : 0

  name = var.policy_name
  role = aws_iam_role.ecr_access[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchImportUpstreamImage",
          "ecr:GetImageCopyStatus",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
        Resource = "*"
      }
    ]
  })
}

# Repository creation template for the cache namespace
resource "aws_ecr_repository_creation_template" "this" {
  count = local.create_template ? 1 : 0

  prefix      = var.cache_namespace
  description = var.repository_creation_template_description
  applied_for = ["PULL_THROUGH_CACHE"]

  custom_role_arn      = local.creation_role_arn
  image_tag_mutability = var.image_tag_mutability
  lifecycle_policy     = var.lifecycle_policy
  repository_policy    = var.repository_policy
  resource_tags        = length(var.repository_tags) > 0 ? var.repository_tags : null

  encryption_configuration {
    encryption_type = var.encryption_type
    kms_key         = local.kms_key_arn
  }

  depends_on = [aws_iam_role_policy.repository_creation]
}

# Role ECR assumes to create cache repositories (template customRoleArn)
resource "aws_iam_role" "repository_creation" {
  count = local.create_creation_role ? 1 : 0

  name        = var.creation_role_name
  description = "Assumed by Amazon ECR to create Echo pull-through cache repositories under ${var.cache_namespace}/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecr.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "repository_creation" {
  count = local.create_creation_role ? 1 : 0

  name = var.creation_policy_name
  role = aws_iam_role.repository_creation[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat(
      [
        {
          Sid    = "CreateCacheRepositories"
          Effect = "Allow"
          Action = concat(
            ["ecr:CreateRepository", "ecr:TagResource"],
            var.lifecycle_policy != null ? ["ecr:PutLifecyclePolicy"] : [],
            var.repository_policy != null ? ["ecr:SetRepositoryPolicy"] : [],
          )
          Resource = local.cache_repository_arn_pattern
        }
      ],
      local.use_kms ? [
        {
          Sid      = "UseKmsKeyForCacheRepositories"
          Effect   = "Allow"
          Action   = ["kms:CreateGrant", "kms:RetireGrant", "kms:DescribeKey"]
          Resource = local.kms_key_arn
        }
      ] : []
    )
  })
}

# Optional module-created customer managed key
resource "aws_kms_key" "this" {
  count = local.create_kms_key ? 1 : 0

  description             = "Encrypts Echo pull-through cache repositories under ${var.cache_namespace}/"
  deletion_window_in_days = var.kms_key_deletion_window_in_days
  enable_key_rotation     = var.kms_key_enable_key_rotation

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "EnableIAMUserPermissions"
        Effect    = "Allow"
        Principal = { AWS = "arn:${local.partition}:iam::${local.account_id}:root" }
        Action    = "kms:*"
        Resource  = "*"
      },
      {
        Sid       = "AllowEcrRepositoryCreationRole"
        Effect    = "Allow"
        Principal = { AWS = "arn:${local.partition}:iam::${local.account_id}:root" }
        Action    = ["kms:CreateGrant", "kms:RetireGrant", "kms:DescribeKey"]
        Resource  = "*"
        Condition = {
          ArnEquals = { "aws:PrincipalArn" = local.creation_role_arn }
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_kms_alias" "this" {
  count = local.create_kms_key && var.kms_key_alias != null ? 1 : 0

  name          = var.kms_key_alias
  target_key_id = aws_kms_key.this[0].key_id
}
