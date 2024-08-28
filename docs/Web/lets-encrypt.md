---
title: Let's Encrypt
---

Install certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Edit nginx config file

```bash
sudo nano /etc/nginx/sites-available/default
```

Add domain names

```conf
server_name example.com <www.example.com>;
```

Check config files

```bash
sudo nginx -t
```

Reload nginx

```bash
sudo systemctl reload nginx
```

Create new cert

```bash
sudo certbot --nginx -d example.com -d <www.example.com> --non-interactive --agree-tos -m <admin@example.com>
```

Check timer

```bash
systemctl status certbot.timer
```

Check work

```bash
sudo certbot renew --dry-run
```

For CentOS add to cron

```bash
crontab -e
30 4 ** * /usr/bin/certbot renew --quiet
```
