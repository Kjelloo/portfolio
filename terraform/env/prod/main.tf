module "platform" {
  source              = "../../module/"
  environment         = "prod"

  vercel_project_name = "portfolio"
  vercel_domain       = "kjell.schoke.dk"
  github_repo         = "kjelloo/portfolio"
}
