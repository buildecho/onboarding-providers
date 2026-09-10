mock_provider "nexus" {}

run "plans_echo_nuget_proxy" {
  command = plan

  variables {
    repository_name        = "echo-test"
    echo_library_nuget     = true
    echo_library_key_name  = "et-test"
    echo_library_key_value = "test-only-token"
  }

  assert {
    condition     = length(nexus_repository_nuget_proxy.echo_nuget) == 1
    error_message = "Enabling echo_library_nuget must create one NuGet proxy."
  }

  assert {
    condition     = nexus_repository_nuget_proxy.echo_nuget[0].name == "echo-test-nuget"
    error_message = "The NuGet repository name must derive from repository_name."
  }

  assert {
    condition     = nexus_repository_nuget_proxy.echo_nuget[0].nuget_version == "V3"
    error_message = "The NuGet proxy must use protocol version V3."
  }

  assert {
    condition     = nexus_repository_nuget_proxy.echo_nuget[0].proxy[0].remote_url == "https://nuget.echohq.com/index.json"
    error_message = "The NuGet proxy must use Echo's V3 service index."
  }

  assert {
    condition     = nexus_repository_nuget_proxy.echo_nuget[0].http_client[0].authentication[0].type == "username"
    error_message = "The NuGet proxy must use challenge-response Basic authentication."
  }

  assert {
    condition     = nexus_repository_nuget_proxy.echo_nuget[0].http_client[0].authentication[0].username == "et-test"
    error_message = "The NuGet proxy must use the Echo library-key subject."
  }

  assert {
    condition     = contains(output.library_repository_keys, "echo-test-nuget")
    error_message = "The NuGet repository name must be included in module outputs."
  }
}

run "omits_echo_nuget_proxy_when_disabled" {
  command = plan

  variables {
    echo_library_nuget = false
  }

  assert {
    condition     = length(nexus_repository_nuget_proxy.echo_nuget) == 0
    error_message = "Disabling echo_library_nuget must not create a NuGet proxy."
  }
}
