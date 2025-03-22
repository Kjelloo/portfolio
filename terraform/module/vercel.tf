resource "vercel_project" "portfolio" {
  name = var.vercel_project_name
  framework = "angular"
  serverless_function_region = "fra1"

  git_repository = {
    type = "github"
    repo = var.github_repo
  }
}

resource "vercel_project_domain" "portfolio" {
  project_id = vercel_project.portfolio.id
  git_branch = var.environment == "prod" ? "master" : "dev"
  domain     = var.vercel_domain
}
