---
title: Update from Source
---

1. Скачать исходный код со страницы [https://www.zabbix.com/download_sources](https://www.zabbix.com/download_sources)  папку с указанием версии `/home/zabbix6.0.26`

    ```bash
    wget https://cdn.zabbix.com/zabbix/sources/stable/6.0/zabbix-6.0.26.tar.gz
    ```

2. Зайти в неё и распаковать скачанный архив

    ```bash
    tar -zxvf zabbix-6.0.26.tar.gz
    ```

3. Зайти в распакованную папку и выполнить

    ```bash
    ./configure --enable-server --enable-agent --with-mysql --enable-ipv6 --with-net-snmp --with-libcurl --with-libxml2 --with-openipmi
    ```

4. Если потребуется, то выполнить установку необходимых компонентов

    ```bash
    apt-get install libopenipmi-dev / sudo yum install OpenIPMI-devel
    ```

5. После завершения конфигурирования

    ```bash
    make install
    ```

    Выполнение `make install` установит исполняемые файлы демонов (`zabbix_server`, `zabbix_agentd`, `zabbix_proxy`) в `/usr/local/sbin` и исполняемые файлы клиентов (`zabbix_get`, `zabbix_sender`) в `/usr/local/bin`.

    Файл конфигурации не требует изменений при обновлении `/usr/local/etc/zabbix_server.conf`

6. Скопировать файлы фронтенда из папки исходного кода

    ```bash
    cp -rf /home/zabbix6.0.26/zabbix-6.0.26/ui/* /var/www/html/zabbix/
    ```

7. Перезапуск сервисов

    ```bash
    systemctl restart zabbix-server zabbix-agent apache2
    ```
