resource "vercel_project" "portfolio" {
  name      = "portfolio"
  framework = "angular"
  serverless_function_region = "fra1"

  git_repository = {
    type = "github"
    repo = "Kjelloo/portfolio"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "vercel_project_domain" "portfolio" {
  project_id  = vercel_project.portfolio.id
  domain      = "kjell.schoke.dk"

  lifecycle {
    prevent_destroy = true
  }
}

resource "vercel_project_domain" "portfolio_dev" {
  project_id  = vercel_project.portfolio.id
  git_branch  = "dev"
  domain      = "dev.kjell.schoke.dk"

  lifecycle {
    prevent_destroy = true
  }
}
