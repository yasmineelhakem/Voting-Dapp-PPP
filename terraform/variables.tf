variable "location" {
  description = "The Azure region to deploy resources"
  type        = string
  default     = "West Europe"
}

variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "my-voting-dapp-rg"
}

variable "vnet_name" {
  description = "The name of the virtual network"
  type        = string
  default     = "ppp-network"
}

variable "vnet_address_space" {
  description = "The address space for the virtual network"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "subnet_name" {
  description = "Subnet name"
  type = string
  default     = "ppp-subnet"
}

variable "subnet_address_prefix" {
  description = "The address prefix for the subnet"
  type        = list(string)
  default     = ["10.0.1.0/24"]
}

variable "acr_name" {
  description = "The name of the AKS cluster"
  type        = string
  default     = "votingdapprt3cc" // must be globally unique and must be lowercase without special characters
}
