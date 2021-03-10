locals {
  appid = "acceptessa2"
  # apex_domain       = ""
  # register_endpoint = ""
}

provider "aws" {
  region = "ap-northeast-1"
}

provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}

# terraform {
#   required_version = ">= 0.14.0"

#   backend "s3" {
#     bucket = "xxxxxx"
#     key    = "xxxxxx.tfstate"
#     region = "ap-northeast-1"
#   }
# }
