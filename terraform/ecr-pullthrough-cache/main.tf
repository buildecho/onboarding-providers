terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

# ECR Pullthrough Cache Rule
resource "aws_ecr_pull_through_cache_rule" "this" {
  count = var.create ? 1 : 0

  ecr_repository_prefix = var.repository_name_prefix
  upstream_registry_url = "${var.source_registry_account_id}.dkr.ecr.${var.source_registry_region}.amazonaws.com"

  custom_role_arn = aws_iam_role.ecr_access[0].arn

  depends_on = [aws_iam_role.ecr_access]
}

# IAM Role for ECR access
resource "aws_iam_role" "ecr_access" {
  count = var.create ? 1 : 0

  name = "${var.cache_rule_name}-access-role"

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

  name = "ECRPullthroughCachePolicy"
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
