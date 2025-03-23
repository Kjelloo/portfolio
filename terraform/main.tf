terraform {
  cloud {
    organization = "schoke"
    workspaces {
      name = "portfolio"
    }
  }

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~>2.0"
    }
  }
}

provider "vercel" {}
