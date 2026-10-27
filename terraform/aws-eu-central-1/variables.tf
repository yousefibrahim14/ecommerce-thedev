variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "Project resource name prefix"
  type        = string
  default     = "ecommerce-lab"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.20.0.0/16"
}

variable "db_username" {
  description = "RDS master username"
  type        = string
  default     = "ecommerce_admin"
}

variable "db_password" {
  description = "Temporary lab database password"
  type        = string
  sensitive   = true
  nullable    = false
}

variable "db_instance_class" {
  description = "Small RDS instance for lab usage"
  type        = string
  default     = "db.t3.micro"
}

variable "db_storage_gb" {
  description = "Initial RDS storage in GiB"
  type        = number
  default     = 20
}

variable "eks_kubernetes_version" {
  description = "EKS Kubernetes version"
  type        = string
  default     = "1.36"
}

variable "eks_api_allowed_cidr" {
  description = "Public IP CIDR allowed to access the EKS API"
  type        = string
  default     = "156.198.228.37/32"

  validation {
    condition     = can(cidrhost(var.eks_api_allowed_cidr, 0))
    error_message = "Provide a valid CIDR, preferably your fixed public IP with /32."
  }
}
