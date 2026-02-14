variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-north-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "Amazon Linux 2 AMI ID"
  type        = string
  default = "ami-0c83cb1c664994bbd"
}

variable "key_name" {
  description = "EC2 key pair name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "finance-tracker"
}
