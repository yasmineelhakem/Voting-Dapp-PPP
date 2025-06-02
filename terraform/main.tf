# Create a resource group
resource "azurerm_resource_group" "voting_dapp_rg" {
  name     = var.resource_group_name
  location = var.location
}

# Create a virtual network within the resource group
resource "azurerm_virtual_network" "voting_dapp_vnet" {
  name                = var.vnet_name
  resource_group_name = azurerm_resource_group.voting_dapp_rg.name
  location            = azurerm_resource_group.voting_dapp_rg.location
  address_space       = var.vnet_address_space
}

# Create a subnet within the virtual network
resource "azurerm_subnet" "voting_dapp_subnet" {
  name                 = var.subnet_name
  resource_group_name  = azurerm_resource_group.voting_dapp_rg.name
  virtual_network_name = azurerm_virtual_network.voting_dapp_vnet.name
  address_prefixes     = var.subnet_address_prefix
}