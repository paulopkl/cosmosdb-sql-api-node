terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.7.0"
    }
  }
}

provider "azurerm" {
  features {}

  # client_id       = "your-client-id"         # Service Principal Application ID
  # client_secret   = "your-client-secret"     # Service Principal Password
  # tenant_id       = "your-tenant-id"         # Your Azure Tenant ID
  subscription_id = var.azure_subscription_id # Your Azure Subscription ID
}

# Create a resource group
resource "azurerm_resource_group" "nodejs_rg" {
  name     = var.azurerm_resource_group_name
  location = "East US"
}

# Create a Cosmos DB account
resource "azurerm_cosmosdb_account" "example" {
  name                = var.azurerm_cosmosdb_account_name
  resource_group_name = azurerm_resource_group.nodejs_rg.name
  location            = azurerm_resource_group.nodejs_rg.location
  offer_type          = "Standard"

  consistency_policy {
    consistency_level = "Session"
  }

  capabilities {
    name = "EnableServerless" # Optional: use this for a serverless account
  }

  geo_location {
    location          = azurerm_resource_group.nodejs_rg.location
    failover_priority = 0
  }

  # If you want to enable additional features, you can include more configurations here
}

# # Optional: Create a database
resource "azurerm_cosmosdb_sql_database" "example" {
  name                = var.azurerm_cosmosdb_database_name
  resource_group_name = azurerm_resource_group.nodejs_rg.name
  account_name        = azurerm_cosmosdb_account.example.name
  # throughput          = 400 # Set provisioned throughput
}

# # Optional: Create a container
resource "azurerm_cosmosdb_sql_container" "example" {
  name = var.azurerm_cosmosdb_container_name

  resource_group_name = azurerm_resource_group.nodejs_rg.name
  account_name        = azurerm_cosmosdb_account.example.name
  database_name       = azurerm_cosmosdb_sql_database.example.name

  partition_key_paths   = ["/category"] # Set your partition key
  partition_key_version = 1
  # throughput            = 400 # Set provisioned throughput for the container

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/category"
    }

    excluded_path {
      path = "/excluded/?"
    }
  }

  unique_key {
    paths = ["/id"]
  }
}
