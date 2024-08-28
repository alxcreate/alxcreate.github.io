---
title: Nginx SSL сертификат
---

Создаем приватный ключ

```bash
openssl genrsa -out servername.key 2048
```

Создаем файл запроса ключа

```bash
nano servername-key.conf
```

C содержимым

```conf title="servername-key.conf"
[req]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_extensions
distinguished_name = dn

[dn]
C=CA # Country Name
ST=Region # State or Province
L=Town # Locality or City
O=Global Security
OU=IT Department # Organizational Unit
emailAddress=email@domain.com # Email
CN = servername # Common Name

[req_extensions]
subjectAltName = @alter_name

[alter_name]
DNS.1 = servername.domain.com
```

Создаем запрос на сертификат

```bash
openssl req -new -key servername.key -out servername.csr -config servername-key.conf

cat servername.csr
```

Используем `servername.csr` для **Microsoft Active Directory Certificate Services**

Если **Microsoft Active Directory Certificate Services** не принимает, то конвертировать в **base64**

```bash
openssl base64 -in servername.csr -out servername_base64.csr

cat servername_base64.csr
```

Конвертируем полученный файл для веб сервера

```bash
openssl x509 -inform DER -in servername.cer -out servername.crt
```

Меняем права доступа

```bash
chmod 400 servername.key
chmod 400 servername.crt
```

Конвертируем сертификат в формат **PEM**

```bash
openssl x509 -inform der -in ca.cer -out ca.pem
```

Копируем сертификат в директорию

```bash
cp ./certs/ca.pem /usr/local/share/ca-certificates/ca.crt
```

Обновляем сертификаты

```bash
update-ca-certificates
```

Добавляем сертификат в Nginx

```bash
nano /etc/nginx/sites-available/default
```

```conf
server {
    listen 443 ssl;
    server_name server.com;

    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    # ...
}
```

Перезапускаем Nginx

```bash
sudo systemctl restart nginx
```
