---
title: Update from Source
---

1. Download source from [https://www.zabbix.com/download_sources](https://www.zabbix.com/download_sources) to folder `/home/zabbix7.0.4`

    ```bash
    wget https://cdn.zabbix.com/zabbix/sources/stable/7.0/zabbix-7.0.4.tar.gz -P /home/zabbix7.0.4
    ```

2. Extract source

    ```bash
    cd /home/zabbix7.0.4
    tar -zxvf zabbix-7.0.4.tar.gz
    ```

3. Execute `configure` with necessary options

    ```bash
    cd /home/zabbix7.0.4/zabbix-7.0.4
    ./configure --enable-server --enable-agent --with-mysql --enable-ipv6 --with-net-snmp --with-libcurl --with-libxml2 --with-openipmi
    ```

4. If necessary, install the necessary components

    ```bash
    apt-get install libopenipmi-dev / sudo yum install OpenIPMI-devel
    ```

5. After successful configuration, compile and install

    ```bash
    make install
    ```

    The `make install` command will install the daemon executables (`zabbix_server`, `zabbix_agentd`, `zabbix_proxy`) in `/usr/local/sbin` and the client executables (`zabbix_get`, `zabbix_sender`) in `/usr/local/bin`.

    The configuration files will be installed in `/usr/local/etc/zabbix_server.conf`.

6. Copy frontend files from source folder

    ```bash
    cp -rf /home/zabbix7.0.4/zabbix-7.0.4/ui/* /var/www/html/zabbix/
    ```

7. If required, edit php.ini file

    ```bash
    nano /etc/php/8.3/apache2/php.ini
    ```

8. Restart services

    ```bash
    systemctl restart zabbix-server zabbix-agent apache2
    ```
