data "aws_partition" "current" {}
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  partition    = data.aws_partition.current.partition
  owner_id     = data.aws_caller_identity.current.account_id
  region       = data.aws_region.current.region
  consumer_arn = "arn:${local.partition}:iam::${var.consumer_account_id}:role/${var.consumer_creation_role_name}"

  # Principal is the consumer account root, narrowed by aws:PrincipalArn, so the
  # key policy can be applied before the consumer role exists.
  consumer_statement = {
    Sid       = "AllowEchoEcrRepositoryCreationRole${var.consumer_account_id}"
    Effect    = "Allow"
    Principal = { AWS = "arn:${local.partition}:iam::${var.consumer_account_id}:root" }
    Action    = ["kms:CreateGrant", "kms:RetireGrant", "kms:DescribeKey"]
    Resource  = "*"
    Condition = merge(concat(
      [{ ArnEquals = { "aws:PrincipalArn" = local.consumer_arn } }],
      var.require_ecr_via_service ? [{ StringEquals = { "kms:ViaService" = "ecr.${local.region}.amazonaws.com" } }] : []
    )...)
  }

  key_policy = {
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "EnableIAMUserPermissions"
        Effect    = "Allow"
        Principal = { AWS = "arn:${local.partition}:iam::${local.owner_id}:root" }
        Action    = "kms:*"
        Resource  = "*"
      },
      local.consumer_statement
    ]
  }
}

resource "aws_kms_key" "this" {
  count = var.create_kms_key ? 1 : 0

  description             = "Encrypts Echo ECR pull-through cache repositories in account ${var.consumer_account_id}"
  deletion_window_in_days = var.kms_key_deletion_window_in_days
  enable_key_rotation     = var.kms_key_enable_key_rotation
  policy                  = jsonencode(local.key_policy)

  tags = var.tags
}

resource "aws_kms_alias" "this" {
  count = var.create_kms_key && var.kms_key_alias != null ? 1 : 0

  name          = var.kms_key_alias
  target_key_id = aws_kms_key.this[0].key_id
}
