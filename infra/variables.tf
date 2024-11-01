variable "azurerm_resource_group_name" {
  description = "Name of CosmosDB Resource Group"
  default = "nodejs-rg-cosmosdb"
  type    = string
}

variable "azurerm_cosmosdb_account_name" {
  description = "CosmosDB account name"
  default = "nodejs-my-cosmosdb-account"
  type    = string
}

variable "azurerm_cosmosdb_database_name" {
  description = "CosmosDB database name"
  default = "example-database"
  type    = string
}

variable "azurerm_cosmosdb_container_name" {
  description = "CosmosDB container name"
  default = "example-container"
  type    = string
}

variable "azure_subscription_id" {
  description = "Your Azure Subscription"
  default = "e0be9cf8-...-...-...-..."
  type    = string
}
