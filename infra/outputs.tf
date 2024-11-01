output "endpoint_url" {
  value = azurerm_cosmosdb_account.example.endpoint
}

output "database_name" {
  value = var.azurerm_cosmosdb_database_name
}

output "container_name" {
  value = var.azurerm_cosmosdb_container_name
}
