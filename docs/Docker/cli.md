---
title: CLI
---

## Install

```bash
#!/bin/sh
apk update
# Install dependencies
apk add --no-cache curl ca-certificates
# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/alpine/gpg | gpg --import
# Add Docker repository
echo "https://download.docker.com/linux/alpine/v3.14/stable" >> /etc/apk/repositories
# Update repository
apk update
# Install Docker
apk add --no-cache docker
# Add current user to the docker group to use Docker without sudo
addgroup $USER docker
# Restart Docker service
service docker restart
```

## Parameters

- `-d` background mode
- `-t` attach pseudo-tty to container
- `-i` out to terminal STDIN stream of container
- `--name` container name
- `--dns` dns server
- `--rm` remove container after stop
- `--memory` memory limit
- `--memory-swap` swap limit
- `--cpus` cpu limit
- `--device` mount device from /dev
- `--expose` forward port from container
- `-P` forward all ports from container
- `--link` connect container to another
- `-e` add environment variable
- `--volume` mount folder
- `--build-arg` argument for build
- `--platform linux/amd64` set platform for build

## Example

```bash
# Start container
docker run --name Ubuntu1804 ubuntu:18.04
# Connect to container
docker attach Ubuntu1804
# Remove container
docker rm Ubuntu1804
# Forwards the container port 80 to the host port 8080
docker run --name Nginx -p 8080:80 -d nginx
# Set variable
docker run -it -e "FOO=bar" --name Ubuntu1804 ubuntu:18.04 /bin/bash
echo $FOO
# Mount folder
docker run -it -v "~/test_docker:/mnt" --name Ubuntu1804 ubuntu:18.04 /bin/bash
# Mount volume
docker run -it -v docker_volume:/mnt --rm --name Ubuntu1804 ubuntu:18.04 /bin/bash
# Volume list
docker volume list
# Create network
docker network create -d bridge docker_network
# Network list
docker network list
# Download image
docker pull node
# Image info
docker image inspect node
```
