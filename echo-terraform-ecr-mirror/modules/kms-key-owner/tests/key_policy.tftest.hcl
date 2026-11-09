mock_provider "aws" {
  override_data {
    target = data.aws_caller_identity.current
    values = {
      account_id = "222222222222"
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
}

variables {
  consumer_account_id = "111111111111"
}

run "key_policy_allows_consumer_role" {
  command = plan

  assert {
    condition     = strcontains(aws_kms_key.this[0].policy, "\"aws:PrincipalArn\":\"arn:aws:iam::111111111111:role/echo-ecr-repo-creation-role\"")
    error_message = "Key policy must allow exactly the consumer creation role."
  }

  assert {
    condition     = strcontains(aws_kms_key.this[0].policy, "arn:aws:iam::222222222222:root") && !strcontains(aws_kms_key.this[0].policy, "kms:ViaService")
    error_message = "Key policy must keep the owner account admin statement and omit ViaService by default."
  }
}

run "statement_only_with_via_service" {
  command = plan

  variables {
    create_kms_key          = false
    require_ecr_via_service = true
  }

  assert {
    condition     = length(aws_kms_key.this) == 0
    error_message = "No key must be created when create_kms_key = false."
  }

  assert {
    condition     = jsondecode(output.consumer_key_policy_statement).Condition.StringEquals["kms:ViaService"] == "ecr.us-east-1.amazonaws.com"
    error_message = "ViaService condition must be added when requested."
  }
}
