mock_provider "artifactory" {}

run "plans_echo_nuget_remote" {
  command = plan

  variables {
    remote_repository_name  = "echo-test"
    echo_library_nuget      = true
    echo_library_key_name   = "et-test"
    echo_library_key_value  = "test-only-token"
    store_artifacts_locally = true
  }

  assert {
    condition     = length(artifactory_remote_nuget_repository.echo_nuget) == 1
    error_message = "Enabling echo_library_nuget must create one NuGet remote."
  }

  assert {
    condition     = artifactory_remote_nuget_repository.echo_nuget[0].key == "echo-test-nuget"
    error_message = "The NuGet repository key must derive from remote_repository_name."
  }

  assert {
    condition     = artifactory_remote_nuget_repository.echo_nuget[0].url == "https://nuget.echohq.com"
    error_message = "The NuGet remote must point at Echo."
  }

  assert {
    condition     = artifactory_remote_nuget_repository.echo_nuget[0].v3_feed_url == "https://nuget.echohq.com/index.json"
    error_message = "The NuGet v3 feed must point at Echo instead of nuget.org."
  }

  assert {
    condition     = artifactory_remote_nuget_repository.echo_nuget[0].symbol_server_url == ""
    error_message = "The nuget.org symbol server must be disabled."
  }

  assert {
    condition     = artifactory_remote_nuget_repository.echo_nuget[0].force_nuget_authentication
    error_message = "The NuGet remote must challenge clients for their JFrog credentials."
  }

  assert {
    condition     = artifactory_remote_nuget_repository.echo_nuget[0].username == "et-test"
    error_message = "The NuGet remote must use the Echo library-key subject."
  }

  assert {
    condition     = artifactory_remote_nuget_repository.echo_nuget[0].store_artifacts_locally
    error_message = "The customer NuGet remote must retain pull-through caching."
  }

  assert {
    condition     = contains(output.library_repository_keys, "echo-test-nuget")
    error_message = "The NuGet repository key must be included in module outputs."
  }

  assert {
    condition     = strcontains(output.usage_instructions, "/api/nuget/v3/echo-test-nuget/index.json")
    error_message = "The NuGet usage instructions must point at Artifactory's v3 service index."
  }
}
