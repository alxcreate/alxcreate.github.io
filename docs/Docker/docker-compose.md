---
title: Docker-Compose
---

[Мультиконтейнерное приложение и Docker Compose](https://doka.guide/tools/docker-compose/)

## Запуск мультиконтейнерного приложения

```bash
# Сборка образов
docker-compose build
# Запуск сервисов (контейнеров)
docker-compose up -d
# Остановка и удаление контейнеров созданных up
docker-compose down
# Журналы
docker-compose logs -f [service name]
# Список контейнеров
docker-compose ps
# Выполнение команды в контейнере
docker-compose exec [service name] [command]
# Список образов
docker-compose images
```

В файле `docker-compose.yaml` могут быть следующие элементы верхнего уровня:

- `services` - список всех контейнеров, которые нужно будет запустить;
- `networks` - список подсетей, которые объединяют группы контейнеров в виртуальную локальную сеть;
- `volumes` - список томов, которые будут доступны контейнерам, описанным в файле конфигурации;
- `configs` - список параметров, которые позволяют запускать контейнеры в различных режимах, не собирая их заново;
- `secrets` - список чувствительных с точки зрения безопасности параметров.

## Пример 1 (веб сервер и БД)

```yaml title="compose.yml"
version: "3.9"
services:
  # Образ MySQL
  db:
    # Указание платформы
    platform: linux/amd64
    # Образ должен храниться локально или в реестре
    image: mysql:5.7
    # Пути монтирования томов
    volumes:
      # Том с данными указан в конце
      - db_data:/var/lib/mysql
    # Автоматический перезапуск при остановке
    restart: always
    # Задание переменных окружения
    environment:
      MYSQL_ROOT_PASSWORD:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD:

  # Образ Wordpress
  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    # Проброс портов
    ports:
      - "8000:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD:
      WORDPRESS_DB_NAME: wordpress

volumes:
  db_data: {}
```

Запуск командой `docker-compose up`

## Пример 2

- `docker-compose.yml`
- `server/` - файлы для работы сервера
- `server/server.py` - код сервера
- `server/index.html` - текст для вывода
- `server/Dockerfile` - инструкции для создания окружения сервера
- `client/` - файлы приложения
- `client/client.py` - код клиента
- `client/Dockerfile` - инструкции для создания окружения сервера

```yaml title="docker-compose.yml"
# Файл docker-compose начинается с тега версии 
version: "3" 
# docker-composes работает с сервисами 
# 1 сервис = 1 контейнер 
services: 
 # Создание двух сервисов 
 # Имя первого сервиса (контейнера) 'server' 
 server: 
   # Путь к файлу Dockerfile для создания образа 
   build: server/ 
   # Запуск команды "python ./server.py" 
   command: python ./server.py 
   # Проброс порта: [порт компьютера]:[порт контейнера] 
   ports: 
     - 1234:1234 
 # Имя второго сервиса (контейнера) 'client' 
 client: 
   # Путь к файлу Dockerfile для создания образа 
   build: client/ 
   # Запуск команды "python ./client.py" 
   command: python ./client.py 
   # 'network_mode' для описания типа сети 
   # Указание, что контейнер может обращаться к 'localhost' компьютера. 
   network_mode: host 
   # 'depends_on' ожидание других сервисов перед запуском 
   # Необходимо чтобы сервис 'client' дождался готовности к работе сервиса 'server'. 
   depends_on: 
     - server
```

```python title="server/server.py"
#!/usr/bin/env python3 
# Импорт системных библиотек python 
# Устанавливается вместе с python 
import http.server 
import socketserver 
# Переменная для обработки запросов клиента к серверу 
handler = http.server.SimpleHTTPRequestHandler 
# Сервер запускается на порте 1234 
# Эти сведения пригодятся при работе с docker-compose 
with socketserver.TCPServer(("", 1234), handler) as httpd: 
# Сервер будет выполняться постоянно, ожидая запросов от клиента 
httpd.serve_forever()
```

```html title="server/index.html"
<h1>Some text</h1>
```

```docker title="server/Dockerfile"
# Импорт базового образа 
FROM python:latest 
# Задаем рабочую директорию для команд 
WORKDIR /server/ 
# Импорт файлов 'server.py' и 'index.html'. 
ADD server.py . 
ADD index.html .
```

```python title="client/client.py"
#!/usr/bin/env python3 
# Импорт системных библиотек python 
# Для загрузки файла 'index.html' с сервера 
# Устанавливается вместе с python 
import urllib.request 
# Переменная запроса к 'http://localhost:1234/' 
fp = urllib.request.urlopen("http://localhost:1234/") 
# 'encodedContent' соответствует закодированному ответу сервера ('index.html') 
# 'decodedContent' соответствует раскодированному ответу сервера (тут будет то, что мы хотим вывести на экран) 
encodedContent = fp.read() 
decodedContent = encodedContent.decode("utf8") 
# Вывод содержимого файла с сервера ('index.html') 
print(decodedContent) 
# Закрываем соединение с сервером. 
fp.close()
```

```docker title="client/Dockerfile"
FROM python:latest 
# Устанавка рабочей директории '/client/' 
WORKDIR /client/ 
# Импорт 'client.py' в папку '/client/' 
ADD client.py .
```
