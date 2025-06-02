# Set the Azure Provider source and version being used
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.0.0"
    }
  }
}

# Configure the Microsoft Azure Provider
# This block sets up how Terraform connects to Azure. You’ll authenticate using environment variables, Azure CLI, or a service principal.
provider "azurerm" {
  resource_provider_registrations = "none" # This is only required when the User, Service Principal, or Identity running Terraform lacks the permissions to register Azure Resource Providers.
  features {}
}

# Create a resource group
resource "azurerm_resource_group" "voting_dapp_rg" {
  name     = "my-voting-dapp-rg"
  location = "West Europe"
}

# Create a virtual network within the resource group
resource "azurerm_virtual_network" "voting_dapp_vnet" {
  name                = "ppp-network"
  resource_group_name = azurerm_resource_group.voting_dapp_rg.name
  location            = azurerm_resource_group.voting_dapp_rg.location
  address_space       = ["10.0.0.0/16"]
}


