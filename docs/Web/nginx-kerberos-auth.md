---
title: Nginx Kerberos Auth
---

Set hostname on web server

```bash
hostnamectl set-hostname web.domain.com
```

Install packages on web server

```bash
apt-get update
# install `libpam-krb5` without interactive wizard
DEBIAN_FRONTEND=noninteractive apt-get install -y libpam-krb5
apt-get install -y nginx nginx-extras ca-certificates msktutil heimdal-clients libpam-heimdal
```

Set auth for site:

```bash
nano /etc/nginx/sites-available/default
```

```conf title="/etc/nginx/sites-available/default"
server {
#...
       location /auth-kerberos {
           auth_pam "Kerberos Authentication";
           auth_pam_service_name "nginx-krb5";
       }
#...
}
```

Create file `/etc/pam.d/nginx`

```bash
nano /etc/pam.d/nginx
```

```conf title="/etc/pam.d/nginx"
auth required pam_krb5.so
account required pam_krb5.so
```

Edit file `/etc/krb5.conf`

```bash
nano /etc/krb5.conf
```

```conf title="/etc/krb5.conf"
[libdefaults]
        default_realm = domain.com

        kdc_timesync = 1
        ccache_type = 4
        forwardable = true
        proxiable = true
        fcc-mit-ticketflags = true
        default_tkt_enctypes = rc4-hmac des-cbc-md5
        default_tgs_enctypes = rc4-hmac des-cbc-md5
        permitted_enctypes = des3-hmac-sha1

[realms]
        domain.com = {
                kdc = dc.domain.com
                kdc = dc2.domain.com
                ...
                admin_server = dc.domain.com
        }
```

Restart nginx

```bash
nginx -s restart
```

Open site in browser and try to auth with domain user.
