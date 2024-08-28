---
title: Install
---

## Registry access

```bash
docker login registry.example.com -u <your_username> -p <your_personal_access_token>
docker run registry.gitlab.com/user/repository:main
```

## Setup

Set up the GitLab server and GitLab Runner.

```yaml title="docker-compose.yml"
version: '3'
services:
  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    restart: always
    hostname: 'gitlab.example.com'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://localhost'
        gitlab_rails['gitlab_shell_ssh_port'] = 2224
    ports:
      - '80:80'
      - '443:443'
      - '2224:22'
    networks:
      - web-gitlab
    
  runner:
    image: 'gitlab/gitlab-runner:latest'
    restart: always
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock'
    ports:
      - '8093:8093'
    networks:
      - web-gitlab

networks:
  web-gitlab:
    driver: bridge
```

### Set password

```bash
gitlab-rake "gitlab:password:reset[root]"

Enter password:
Confirm password:
Password successfully updated for user with username root.
```

### Register runner

Copy the token from the **GitLab Project** > **Settings** > **CI/CD** > **Runners**.

```bash
gitlab-runner register  --url https://gitlab.example.com  --registration-token <TOKEN> --docker-privileged
```

Default image `docker:24.0.9-dind`

Config will be in `/etc/gitlab-runner/config.toml`

### Start runner

```bash
gitlab-runner start
```
