module "platform" {
  source              = "../../module/"
  environment         = "dev"

  vercel_project_name = "portfolio"
  vercel_domain       = "dev.kjell.schoke.dk"
  github_repo         = "kjelloo/portfolio"
}
