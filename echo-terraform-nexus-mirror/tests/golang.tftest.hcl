mock_provider "nexus" {}

run "plans_echo_go_proxy" {
  command = plan

  variables {
    repository_name        = "echo-test"
    echo_library_golang    = true
    echo_library_key_name  = "et-test"
    echo_library_key_value = "test-only-token"
  }

  assert {
    condition     = length(nexus_repository_go_proxy.echo_go) == 1
    error_message = "Enabling echo_library_golang must create one Go proxy."
  }

  assert {
    condition     = nexus_repository_go_proxy.echo_go[0].name == "echo-test-go"
    error_message = "The Go repository name must derive from repository_name."
  }

  assert {
    condition     = nexus_repository_go_proxy.echo_go[0].proxy[0].remote_url == "https://golang.echohq.com"
    error_message = "The Go proxy must use Echo's module proxy."
  }

  assert {
    condition     = nexus_repository_go_proxy.echo_go[0].http_client[0].authentication[0].type == "username"
    error_message = "The Go proxy must use challenge-response Basic authentication."
  }

  assert {
    condition     = nexus_repository_go_proxy.echo_go[0].http_client[0].authentication[0].username == "et-test"
    error_message = "The Go proxy must use the Echo library-key subject."
  }

  assert {
    condition     = contains(output.library_repository_keys, "echo-test-go")
    error_message = "The Go repository name must be included in module outputs."
  }

  assert {
    condition     = strcontains(output.usage_instructions, "GOPROXY=https://<nexus-host>/repository/echo-test-go/")
    error_message = "The usage instructions must point Go clients at the Nexus proxy."
  }

  assert {
    condition     = strcontains(output.usage_instructions, "~/.netrc")
    error_message = "The usage instructions must explain optional Nexus client authentication."
  }

  assert {
    condition     = !strcontains(output.usage_instructions, "GOSUMDB=off") && !strcontains(output.usage_instructions, ",direct")
    error_message = "The usage instructions must keep checksum verification on and must not add a direct fallback."
  }
}

run "omits_echo_go_proxy_when_disabled" {
  command = plan

  variables {
    echo_library_golang = false
  }

  assert {
    condition     = length(nexus_repository_go_proxy.echo_go) == 0
    error_message = "Disabling echo_library_golang must not create a Go proxy."
  }
}
