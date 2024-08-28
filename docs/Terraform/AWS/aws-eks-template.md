---
title: AWS EKS Template
---

```hcl title="aws_provider.tf"
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
  region = "us-east-1"  # US East (N. Virginia)
}
```

```hcl title="aws_projectname_vpc1.tf"
resource "aws_vpc" "projectname_vpc1" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "projectname_vpc1"
  }
}

resource "aws_subnet" "projectname_subnet" {
  count = 2

  vpc_id            = aws_vpc.projectname_vpc1.id
  cidr_block        = cidrsubnet(aws_vpc.projectname_vpc1.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "projectname_subnet_${count.index + 1}"
  }
}
```

```hcl title="aws_projectname_iam.tf"
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "projectname_eks_cluster_iam_role" {
  name               = "projectname_eks_cluster_iam_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "projectname_AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.projectname_eks_cluster_iam_role.name
}

# Optionally, enable Security Groups for Pods
# Reference: https://docs.aws.amazon.com/eks/latest/userguide/security-groups-for-pods.html
resource "aws_iam_role_policy_attachment" "projectname_AmazonEKSVPCResourceController" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.projectname_eks_cluster_iam_role.name
}
```

```hcl title="aws_projectname_eks_cluster.tf"
resource "aws_eks_cluster" "projectname_eks_cluster" {
  name     = "projectname_eks_cluster"
  role_arn = aws_iam_role.projectname_eks_cluster_iam_role.arn

  vpc_config {
    subnet_ids = aws_subnet.projectname_subnet[*].id
  }

  # Ensure that IAM Role permissions are created before and deleted after EKS Cluster handling.
  # Otherwise, EKS will not be able to properly delete EKS managed EC2 infrastructure such as Security Groups.
  depends_on = [
    aws_subnet.projectname_subnet,
    aws_iam_role_policy_attachment.projectname_AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.projectname_AmazonEKSVPCResourceController,
  ]
}

resource "aws_eks_node_group" "projectname_eks_node_group_app" {
  cluster_name    = aws_eks_cluster.projectname_eks_cluster.name
  node_group_name = "projectname_eks_node_group_app"
  node_role_arn = aws_iam_role.projectname_eks_cluster_iam_role.arn
  subnet_ids = aws_subnet.projectname_subnet[*].id

  scaling_config {
    desired_size = 1
    max_size     = 2
    min_size     = 1
  }
  
  update_config {
    max_unavailable = 1
  }

  remote_access {
    ec2_ssh_key = "" # Add your SSH key here
  }

  depends_on = [
    aws_iam_role_policy_attachment.projectname_AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.projectname_AmazonEKSVPCResourceController,
  ]
}

output "endpoint" {
  value = aws_eks_cluster.projectname_eks_cluster.endpoint
}

output "kubeconfig-certificate-authority-data" {
  value = aws_eks_cluster.projectname_eks_cluster.certificate_authority[0].data
}
```

```hcl title="variables.tf"
variable "AWS_ACCESS_KEY_ID" {
  description = "AWS access key ID"
}

variable "AWS_SECRET_ACCESS_KEY" {
  description = "AWS secret access key"
}

data "aws_availability_zones" "available" {}
```
