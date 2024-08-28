---
title: Install Certbot
---

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo nano /etc/nginx/sites-available/default
```

Edit file

```conf title="/etc/nginx/sites-available/default"
server_name example.com www.example.com;
```

Check and reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Get certificate

```bash
sudo certbot --nginx -d example.com -d www.example.com
certbot --nginx -d example.com -d www.example.com --non-interactive --agree-tos -m admin@example.com
```

Check certbot

```bash
# Check timer
systemctl status certbot.timer
# Check work
sudo certbot renew --dry-run
```

For CentOS add to cron:

```bash
crontab -e
30 4 * * * /usr/bin/certbot renew --quiet
```
