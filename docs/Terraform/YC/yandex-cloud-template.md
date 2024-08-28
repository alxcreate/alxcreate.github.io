---
title: Yandex Cloud Template
---

This is a template for creating an instance in Yandex Cloud.

```hcl title="provider.tf"
terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }
}

provider "yandex" {
  service_account_key_file = "key.json"
  cloud_id  = "${var.yandex_cloud_id}"
  folder_id = "${var.yandex_folder_id}"
}
```

```hcl title="variables.tf"
variable "yandex_cloud_id" {
  default = "" # Add your cloud_id
}

variable "yandex_folder_id" {
  default = "" # Add your folder_id
}

# get ID - yc compute image list
variable "centos-7-base" {
  default = "fd8jvcoeij6u9se84dt5"
}

variable "ubuntu-2204-base" {
  default = "fd8ueg1g3ifoelgdaqhb"
}

variable "centos-8-base" {
  default = "fd8151sv1q69mchl804a"
}

variable "container-optimized-image" {
  default = "fd80o2eikcn22b229tsa"
}
```

```hcl title="network.tf"
resource "yandex_vpc_network" "default" {
  name = "net"
}

resource "yandex_vpc_subnet" "default" {
  name           = "subnet"
  zone           = "ru-central1-a"
  network_id     = yandex_vpc_network.default.id
  v4_cidr_blocks = ["10.0.0.0/24"]
}
```

```hcl title="instance.tf"
resource "yandex_compute_instance" "sandbox-01" {
  name                      = "sandbox-01"
  zone                      = "ru-central1-a"
  hostname                  = "sandbox-01"
  allow_stopping_for_update = true

  resources {
    cores  = 2
    memory = 2
  }
    metadata = {
    ssh-keys = "sandbox-01:${file("~/.ssh/id_rsa.pub")}"

  }

  boot_disk {
    initialize_params {
      image_id = "container-optimized-image"
      name     = "root-sandbox-01"
      type     = "network-nvme"
      size     = "50"
    }
  }

  network_interface {
    subnet_id = yandex_vpc_subnet.default.id
    nat       = true
  }
}
```

```hcl title="output.tf"
output "internal_ip_address_sandbox-01_yandex_cloud" {
  value = yandex_compute_instance.sandbox-01.network_interface.0.ip_address
}

output "external_ip_address_sandbox-01_yandex_cloud" {
  value = yandex_compute_instance.sandbox-01.network_interface.0.nat_ip_address
}
```
