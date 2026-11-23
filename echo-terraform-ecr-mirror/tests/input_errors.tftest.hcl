# Driven by tests/input_errors.sh, which overrides variables with -var to check
# that invalid combinations fail with a helpful message. With defaults it passes.
mock_provider "aws" {
  override_data {
    target = data.aws_region.current
    values = {
      region = "us-east-1"
    }
  }
}

run "plan" {
  command = plan

  variables {
    echo_registry_account_id = "123456789012"
  }
}
