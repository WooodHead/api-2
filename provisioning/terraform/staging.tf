module "api_staging" {
  source             = "./modules/api"
  namespace          = "ps2alerts"
  environment        = "staging"
  identifier         = "ps2alerts-api-staging"
  checksum_version   = var.checksum_version
  database_user      = var.db_user
  database_pass      = var.db_pass
  database_host      = "ps2alerts-db"
  database_port      = 27017
  database_name      = "ps2alerts-staging"
  database_pool_size = 20
  database_debug     = false
  rabbitmq_host      = "ps2alerts-rabbitmq"
  rabbitmq_user      = "ps2alerts"
  rabbitmq_pass      = var.rabbitmq_pass
  rabbitmq_vhost     = "/ps2alerts"
  rabbitmq_queue     = "api-queue-staging"
  cpu_limit          = "500m"
  mem_limit          = "0.5Gi"
  cpu_request        = "500m"
  mem_request        = "0.5Gi"
  logger_transports  = "console"
  dd_api_key         = var.dd_api_key
  dd_app_key         = var.dd_app_key
  multi_urls         = false
  urls               = ["staging.api.ps2alerts.com"]
}