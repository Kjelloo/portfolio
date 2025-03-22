terraform {
  cloud {
    organization = "schoke"
    workspaces {
      name = "portfolio-dev"
    }
  }
}
