mock_provider "aws" {
  override_data {
    target = data.aws_caller_identity.current
    values = {
      account_id = "111111111111"
    }
  }

  override_data {
    target = data.aws_region.current
    values = {
      region = "us-east-1"
    }
  }

  override_data {
    target = data.aws_partition.current
    values = {
      partition = "aws"
    }
  }

  mock_resource "aws_kms_key" {
    defaults = {
      arn    = "arn:aws:kms:us-east-1:111111111111:key/00000000-0000-0000-0000-000000000000"
      key_id = "00000000-0000-0000-0000-000000000000"
    }
  }
}

variables {
  echo_registry_account_id = "123456789012"
}

run "default_creates_no_template" {
  command = plan

  assert {
    condition     = length(aws_ecr_repository_creation_template.this) == 0
    error_message = "No repository creation template must be created by default."
  }

  assert {
    condition     = length(aws_iam_role.repository_creation) == 0 && length(aws_kms_key.this) == 0
    error_message = "No creation role or KMS key must be created by default."
  }

  assert {
    condition     = length(aws_ecr_pull_through_cache_rule.this) == 1 && length(aws_iam_role.ecr_access) == 1
    error_message = "The pull-through cache rule and its role must still be created."
  }
}

run "aes256_template_without_tags_needs_no_role" {
  command = plan

  variables {
    create_repository_creation_template = true
    lifecycle_policy                    = jsonencode({ rules = [] })
  }

  assert {
    condition     = aws_ecr_repository_creation_template.this[0].prefix == "echo"
    error_message = "Template prefix must equal cache_namespace."
  }

  assert {
    condition     = aws_ecr_repository_creation_template.this[0].applied_for == toset(["PULL_THROUGH_CACHE"])
    error_message = "Template must apply to PULL_THROUGH_CACHE."
  }

  assert {
    condition     = aws_ecr_repository_creation_template.this[0].encryption_configuration[0].encryption_type == "AES256"
    error_message = "Default template encryption must be AES256."
  }

  assert {
    condition     = length(aws_iam_role.repository_creation) == 0 && aws_ecr_repository_creation_template.this[0].custom_role_arn == null
    error_message = "AES256 without repository tags must not create or set a creation role."
  }
}

run "repository_tags_create_role" {
  command = plan

  variables {
    create_repository_creation_template = true
    repository_tags                     = { team = "platform" }
  }

  assert {
    condition     = length(aws_iam_role.repository_creation) == 1
    error_message = "Repository tags require a creation role."
  }

  assert {
    condition     = aws_ecr_repository_creation_template.this[0].custom_role_arn == "arn:aws:iam::111111111111:role/echo-ecr-repo-creation-role"
    error_message = "Template must reference the module-created creation role."
  }

  assert {
    condition     = !strcontains(aws_iam_role_policy.repository_creation[0].policy, "kms:")
    error_message = "AES256 creation role must not get KMS permissions."
  }
}

run "existing_same_account_key" {
  command = plan

  variables {
    create_repository_creation_template = true
    encryption_type                     = "KMS"
    kms_key_arn                         = "arn:aws:kms:us-east-1:111111111111:key/1234abcd-12ab-34cd-56ef-1234567890ab"
  }

  assert {
    condition     = aws_ecr_repository_creation_template.this[0].encryption_configuration[0].kms_key == "arn:aws:kms:us-east-1:111111111111:key/1234abcd-12ab-34cd-56ef-1234567890ab"
    error_message = "Template must use the supplied key ARN."
  }

  assert {
    condition     = strcontains(aws_iam_role_policy.repository_creation[0].policy, "kms:CreateGrant") && strcontains(aws_iam_role_policy.repository_creation[0].policy, "key/1234abcd-12ab-34cd-56ef-1234567890ab")
    error_message = "Creation role must be allowed to create grants on the supplied key only."
  }

  assert {
    condition     = strcontains(aws_iam_role_policy.repository_creation[0].policy, "repository/echo/*")
    error_message = "Creation role ECR permissions must be scoped to the cache namespace."
  }

  assert {
    condition     = length(aws_kms_key.this) == 0 && output.kms_key_is_cross_account == false
    error_message = "No key must be created for a supplied same-account key."
  }
}

run "module_created_key" {
  command = plan

  variables {
    create_repository_creation_template = true
    encryption_type                     = "KMS"
    create_kms_key                      = true
  }

  assert {
    condition     = length(aws_kms_key.this) == 1 && length(aws_kms_alias.this) == 1
    error_message = "Module must create the key and its alias."
  }

  assert {
    condition     = strcontains(aws_kms_key.this[0].policy, "arn:aws:iam::111111111111:role/echo-ecr-repo-creation-role")
    error_message = "Key policy must allow the repository creation role."
  }
}

run "cross_account_key" {
  command = plan

  variables {
    create_repository_creation_template = true
    encryption_type                     = "KMS"
    kms_key_arn                         = "arn:aws:kms:us-east-1:222222222222:key/1234abcd-12ab-34cd-56ef-1234567890ab"
  }

  assert {
    condition     = output.kms_key_is_cross_account == true
    error_message = "A key from another account must be reported as cross-account."
  }
}

run "supplied_role_is_used" {
  command = plan

  variables {
    create_repository_creation_template = true
    encryption_type                     = "KMS"
    kms_key_arn                         = "arn:aws:kms:us-east-1:111111111111:key/1234abcd-12ab-34cd-56ef-1234567890ab"
    creation_role_arn                   = "arn:aws:iam::111111111111:role/my-own-role"
  }

  assert {
    condition     = length(aws_iam_role.repository_creation) == 0 && aws_ecr_repository_creation_template.this[0].custom_role_arn == "arn:aws:iam::111111111111:role/my-own-role"
    error_message = "A supplied creation role must be used instead of creating one."
  }
}

run "alias_arn_rejected" {
  command = plan

  variables {
    create_repository_creation_template = true
    encryption_type                     = "KMS"
    kms_key_arn                         = "arn:aws:kms:us-east-1:111111111111:alias/my-key"
  }

  expect_failures = [var.kms_key_arn]
}

run "invalid_lifecycle_policy_rejected" {
  command = plan

  variables {
    create_repository_creation_template = true
    lifecycle_policy                    = "not json"
  }

  expect_failures = [var.lifecycle_policy]
}
