---
title: Install Certbot
---

- `host_vars/node01.txt`

```yaml
---
acme_challenge_type: http-01
acme_directory: https://acme-v02.api.letsencrypt.org/directory
acme_version: 2
acme_email: admin@example.com # email
letsencrypt_dir: /etc/letsencrypt
letsencrypt_keys_dir: /etc/letsencrypt/keys
letsencrypt_csrs_dir: /etc/letsencrypt/csrs
letsencrypt_certs_dir: /etc/letsencrypt/certs
letsencrypt_account_key: /etc/letsencrypt/account/account.key
domain_name: example.com # site
```

- `web01/docker-compose.yml`

```yaml
version: '3'
services:
  web01:
    container_name: web01
    image: docker/image
    restart: always
    command: /bin/sh -c "service nginx start && certbot --nginx -d example.com -d www.example.com --non-interactive --agree-tos -m alx@example.com && tail -f /dev/null"
    ports:
      - "80:80"
      - "443:443"
```

- default.txt

```yaml
server {
    listen 80;
    root /var/www;
    index index.html;
    server_name example.com www.example.com;

    location / {
        try_files $uri $uri/ =404;
    }
}

server {
    listen 443 ssl;
    root /var/www;
    index index.html;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/certs/example.com.crt;
    ssl_certificate_key /etc/letsencrypt/keys/example.com.key;
    ssl_protocols TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

- inventory.yml

```yaml
---
aws:
  hosts:
    node01:
      ansible_host: 1.1.1.1 # Public IP
      ansible_user: ubuntu
```

- letsencrypt-issue.yml

```yaml
---
- hosts: "node01"
  become: true
  tasks:

  - name: "Create required directories in /etc/letsencrypt"
    file:
      path: "/etc/letsencrypt/{{ item }}"
      state: directory
      owner: root
      group: root
      mode: u=rwx,g=x,o=x
    with_items:
    - account
    - certs
    - csrs
    - keys

  - name: "Generate a Let's Encrypt account key"
    shell: "if [ ! -f {{ letsencrypt_account_key }} ]; then openssl genrsa 4096 | sudo tee {{ letsencrypt_account_key }}; fi"

  - name: "Generate Let's Encrypt private key"
    shell: "openssl genrsa 4096 | sudo tee /etc/letsencrypt/keys/{{ domain_name }}.key"

  - name: "Generate Let's Encrypt CSR"
    shell: "openssl req -new -sha256 -key /etc/letsencrypt/keys/{{ domain_name }}.key -subj \"/CN={{ domain_name }}\" -reqexts SAN -config <(cat /etc/ssl/openssl.cnf <(printf \"\n[SAN]\nsubjectAltName=DNS:{{ domain_name }},DNS:www.{{ domain_name }}\")) | sudo tee /etc/letsencrypt/csrs/{{ domain_name }}.csr"
    args:
      executable: /bin/bash

  - name: "Begin Let's Encrypt challenges"
    acme_certificate:
      acme_directory: "{{ acme_directory }}"
      acme_version: "{{ acme_version }}"
      account_key_src: "{{ letsencrypt_account_key }}"
      account_email: "{{ acme_email }}"
      terms_agreed: 1
      challenge: "{{ acme_challenge_type }}"
      csr: "{{ letsencrypt_csrs_dir }}/{{ domain_name }}.csr"
      dest: "{{ letsencrypt_certs_dir }}/{{ domain_name }}.crt"
      fullchain_dest: "{{ letsencrypt_certs_dir }}/fullchain_{{ domain_name }}.crt"
      remaining_days: 91
    register: acme_challenge_example_com

  - name: "Create .well-known/acme-challenge directory"
    file:
      path: /var/www/html/.well-known/acme-challenge
      state: directory
      owner: root
      group: root
      mode: u=rwx,g=rx,o=rx

  - name: "Implement http-01 challenge files"
    copy:
      content: "{{ acme_challenge_example_com['challenge_data'][item]['http-01']['resource_value'] }}"
      dest: "/var/www/html/{{ acme_challenge_example_com['challenge_data'][item]['http-01']['resource'] }}"
      owner: root
      group: root
      mode: u=rw,g=r,o=r
    with_items:
    - "{{ domain_name }}"
    - "www.{{ domain_name }}"

  - name: "Complete Let's Encrypt challenges"
    acme_certificate:
      acme_directory: "{{ acme_directory }}"
      acme_version: "{{ acme_version }}"
      account_key_src: "{{ letsencrypt_account_key }}"
      account_email: "{{ acme_email }}"
      challenge: "{{ acme_challenge_type }}"
      csr: "{{ letsencrypt_csrs_dir }}/{{ domain_name }}.csr"
      dest: "{{ letsencrypt_certs_dir }}/{{ domain_name }}.crt"
      chain_dest: "{{ letsencrypt_certs_dir }}/chain_{{ domain_name }}.crt"
      fullchain_dest: "{{ letsencrypt_certs_dir }}/fullchain_{{ domain_name }}"
      data: "{{ acme_challenge_example_com }}"

  - name: "Remove http-01 challenge files"
    file:
      path: "/var/www/html/.well-known/acme-challenge/{{ item }}"
      state: absent
    with_items:
    - "{{ domain_name }}"
    - "www.{{ domain_name }}"

  - name: "Remove .well-known/acme-challenge directory"
    file:
      path: /var/www/html/.well-known/acme-challenge
      state: absent

  - name: Copy nginx config
    copy:
      src: default
      dest: /etc/nginx/sites-available/default

  - name: Restart nginx
    service:
      name: nginx
      state: restarted
```

- web01.yml

```yaml
---
- hosts: node01
  become: true

  tasks:
    - name: Install aptitude
      apt:
        name: aptitude
        state: latest
        update_cache: true

    - name: Install required system packages
      apt:
        pkg:
          - apt-transport-https
          - ca-certificates
          - curl
          - software-properties-common
          - python3-pip
          - virtualenv
          - python3-setuptools
        state: latest
        update_cache: true

    - name: Add Docker GPG apt Key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Add Docker Repository
      apt_repository:
        repo: deb https://download.docker.com/linux/ubuntu focal stable
        state: present

    - name: Install docker-ce
      apt:
        name: docker-ce
        state: latest
        update_cache: true

    - name: Install Docker SDK for Python
      ansible.builtin.pip:
        name:
          - "docker==6.1.3"
          - "docker-compose"

    - name: Log into DockerHub
      docker_login:
        username: username # DockerHub username
        password: "password"

    - name: Ensure github.com is a known host
      lineinfile:
        dest: /root/.ssh/known_hosts
        create: yes
        state: present
        line: "{{ lookup('pipe', 'ssh-keyscan -t rsa github.com') }}"
        regexp: "^github\\.com"

    - name: Copy files
      copy:
        src: ./web01
        dest: /home
        mode: 0777

    - name: Deploy containers
      community.docker.docker_compose:
        project_src: /home/web01
        files:
          - docker-compose.yml
```
