---
title: Yandex Cloud Template Container Optimised Image
---


This is a template for creating an instance based on a container-optimized image in Yandex Cloud.

## Provider

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
  cloud_id  = "" # Add your cloud_id
  folder_id = "" # Add your folder_id
}
```

```hcl title="instance.tf"
data "yandex_compute_image" "container-optimized-image" {
  family = "container-optimized-image"
}

resource "yandex_compute_instance" "instance-based-on-coi" {
  zone = "ru-central1-a"
  boot_disk {
    initialize_params {
      image_id = data.yandex_compute_image.container-optimized-image.id
    }
  }
  network_interface {
    subnet_id = yandex_vpc_subnet.default.id
    nat = true
  }
  resources {
    cores = 2
    memory = 2

  }
  metadata = {
    docker-container-declaration = file("${path.module}/declaration.yaml")
    user-data = file("${path.module}/cloud_config.yaml")
  }
}
```

```hcl title="network.tf"
# Network
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

```hcl title="output.tf"
output "external_ip" {
  value = yandex_compute_instance.instance-based-on-coi.network_interface.0.nat_ip_address
}
```

```yaml title="cloud_config.yaml"
#cloud-config
ssh_pwauth: no
users:
  - name: yc-user
    sudo: ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    ssh_authorized_keys:
      - "" # Add your public key
```

```yaml title="declaration.yaml"
spec:
  containers:
  - image: cr.yandex/yc/demo/coi:v1
    securityContext:
      privileged: false
    stdin: false
    tty: false
```
