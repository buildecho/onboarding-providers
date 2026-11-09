#!/usr/bin/env bash
# Checks that invalid input combinations fail `terraform plan` with a helpful
# message. Run from the module directory after `terraform init -backend=false`.
set -uo pipefail

key="arn:aws:kms:us-east-1:111111111111:key/1234abcd-12ab-34cd-56ef-1234567890ab"
status=0

expect_error() {
  local pattern="$1"; shift
  local out
  if out=$(terraform test -no-color -filter=tests/input_errors.tftest.hcl "$@" 2>&1); then
    echo "FAIL (expected error): $*"; status=1
  elif ! tr -s " \n" "  " <<<"$out" | grep -q -- "$pattern"; then
    echo "FAIL (missing \"$pattern\"): $*"; echo "$out" | tail -20; status=1
  else
    echo "ok: $pattern"
  fi
}

expect_error 'requires exactly one of' -var create_repository_creation_template=true -var encryption_type=KMS
expect_error 'requires exactly one of' -var create_repository_creation_template=true -var encryption_type=KMS -var create_kms_key=true -var "kms_key_arn=$key"
expect_error 'only used with encryption_type' -var create_repository_creation_template=true -var "kms_key_arn=$key"
expect_error 'same Region' -var create_repository_creation_template=true -var encryption_type=KMS -var "kms_key_arn=${key/us-east-1/eu-west-1}"
expect_error 'only take effect with create_repository_creation_template' -var encryption_type=KMS -var create_kms_key=true

# The error must also surface when the module is used as a child module.
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$tmp/tests"
cat >"$tmp/main.tf" <<HCL
provider "aws" {
  region = "us-east-1"
}

module "echo_ecr_cache" {
  source                              = "$PWD"
  echo_registry_account_id            = "123456789012"
  create_repository_creation_template = true
  encryption_type                     = "KMS"
}
HCL
cat >"$tmp/tests/child.tftest.hcl" <<'HCL'
mock_provider "aws" {}

run "plan" {
  command = plan
}
HCL
if out=$(cd "$tmp" && terraform init -backend=false -input=false >/dev/null && terraform test -no-color 2>&1); then
  echo "FAIL (expected error): child module"; status=1
elif ! grep -q 'requires exactly one of' <<<"$out"; then
  echo "FAIL (missing message): child module"; echo "$out" | tail -20; status=1
else
  echo "ok: child module surfaces input errors"
fi

exit $status
