mock_provider "artifactory" {}

run "plans_echo_go_remote_and_virtual" {
  command = plan

  variables {
    remote_repository_name  = "echo-test"
    echo_library_golang     = true
    echo_library_key_name   = "et-test"
    echo_library_key_value  = "test-only-token"
    store_artifacts_locally = true
  }

  assert {
    condition     = length(artifactory_remote_go_repository.echo_go) == 1
    error_message = "Enabling echo_library_golang must create one Go remote."
  }

  assert {
    condition     = artifactory_remote_go_repository.echo_go[0].key == "echo-test-go-remote"
    error_message = "The Go remote key must derive from remote_repository_name."
  }

  assert {
    condition     = artifactory_remote_go_repository.echo_go[0].url == "https://golang.echohq.com"
    error_message = "The Go remote must point at Echo's module proxy."
  }

  assert {
    condition     = artifactory_remote_go_repository.echo_go[0].vcs_git_provider == "ARTIFACTORY"
    error_message = "The Go remote must treat Echo as a module proxy, not a git host."
  }

  assert {
    condition     = artifactory_remote_go_repository.echo_go[0].username == "et-test"
    error_message = "The Go remote must use the Echo library-key subject."
  }

  assert {
    condition     = artifactory_remote_go_repository.echo_go[0].store_artifacts_locally
    error_message = "The customer Go remote must retain pull-through caching."
  }

  assert {
    condition     = length(artifactory_virtual_go_repository.echo_go) == 1
    error_message = "Enabling echo_library_golang must create the virtual clients resolve through."
  }

  assert {
    condition     = artifactory_virtual_go_repository.echo_go[0].key == "echo-test-go"
    error_message = "The Go virtual key must derive from remote_repository_name."
  }

  assert {
    condition     = artifactory_virtual_go_repository.echo_go[0].external_dependencies_enabled == false
    error_message = "External dependencies must stay off so Artifactory cannot clone around Echo."
  }

  assert {
    condition     = artifactory_virtual_go_repository.echo_go[0].artifactory_requests_can_retrieve_remote_artifacts == false
    error_message = "The customer virtual must not retrieve remote artifacts on behalf of another Artifactory instance."
  }

  assert {
    condition     = contains(artifactory_virtual_go_repository.echo_go[0].repositories, "echo-test-go-remote")
    error_message = "The virtual must include the Echo Go remote."
  }

  assert {
    condition     = contains(output.library_repository_keys, "echo-test-go")
    error_message = "The Go virtual key must be included in module outputs."
  }

  assert {
    condition     = !contains(output.library_repository_keys, "echo-test-go-remote")
    error_message = "The internal Go remote key must not be advertised as a client endpoint."
  }

  assert {
    condition     = strcontains(output.usage_instructions, "/api/go/echo-test-go")
    error_message = "Go usage instructions must point GOPROXY at the virtual repository."
  }

  assert {
    condition     = strcontains(output.usage_instructions, "~/.netrc")
    error_message = "Go usage instructions must explain optional Artifactory client authentication."
  }

  assert {
    condition     = strcontains(output.usage_instructions, "go mod download") && !strcontains(output.usage_instructions, "GOSUMDB=off") && !strcontains(output.usage_instructions, ",direct")
    error_message = "Go usage instructions must run outside a module while preserving checksum verification and the Echo-only route."
  }
}

run "omits_echo_go_repositories_when_disabled" {
  command = plan

  variables {
    echo_library_golang = false
  }

  assert {
    condition     = length(artifactory_remote_go_repository.echo_go) == 0 && length(artifactory_virtual_go_repository.echo_go) == 0
    error_message = "Disabling echo_library_golang must not create Go repositories."
  }
}
