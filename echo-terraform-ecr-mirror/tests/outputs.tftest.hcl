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
      region = "us-west-2"
    }
  }
}

run "plans_usage_instructions" {
  command = plan

  variables {
    echo_registry_account_id = "123456789012"
  }

  assert {
    condition     = output.usage_instructions == "docker pull 111111111111.dkr.ecr.us-west-2.amazonaws.com/echo/<image>:<tag>"
    error_message = "Usage instructions must use the account ID and region of the configured provider."
  }
}
