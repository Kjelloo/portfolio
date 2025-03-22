terraform {
  required_version = "~>1.11"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~>2.0"
    }
  }
}
