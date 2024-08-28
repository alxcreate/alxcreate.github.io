---
title: Install SNMP Trapper
---

```bash
yum install net-snmp net-snmp-utils

cd /usr/local/src
sudo yum install wget
wget https://deac-riga.dl.sourceforge.net/project/snmptt/snmptt/snmptt_1.4.2/snmptt_1.4.2.tgz
yum install tar
tar xfz snmptt_*.tgz
cd snmp

cp snmptt-init.d /etc/rc.d/init.d/snmptt
chkconfig –add snmptt
chkconfig –level 2345 snmptt on
cpan install Config::IniFiles
systemctl status snmptt.service

cp -rv snmptt snmpttconvert snmpttconvertmib snmptthandler-embedded /usr/sbin/
chmod 755 /usr/sbin/snmptt*
cp -nv snmptt.ini /etc/snmp/snmptt.ini
cp -nv snmptt.logrotate /etc/logrotate.d/snmptt

useradd -N -r snmptt
mkdir -pv /var/log/snmptt
mkdir -pv /var/spool/snmptt
chown snmptt /var/log/snmptt /var/spool/snmptt

cp -vn /etc/snmp/snmptrapd.conf /etc/snmp/snmptrapd.conf.default
cat <<EOF >> /etc/snmp/snmptrapd.conf
authCommunity log,execute,net public
 perl do "/usr/sbin/snmptthandler-embedded";
#perl do "/usr/lib/snmptt/snmptthandler-embedded";
EOF

sed -i "s/OPTIONS='-Lsd/OPTIONS='-On -Lsd/" /etc/sysconfig/snmptrapd

sed -i 's;#date_format = %a %b %e %Y;date_format = %H:%M:%S %Y/%m/%d;' /etc/snmp/snmptt.ini
sed -i 's/syslog_enable = 1/syslog_enable = 0/' /etc/snmp/snmptt.ini
sed -i 's/net_snmp_perl_enable = 0/net_snmp_perl_enable = 1/' /etc/snmp/snmptt.ini
sed -i 's/net_snmp_perl_cache_enable = 0/net_snmp_perl_cache_enable = 1/' /etc/snmp/snmptt.ini

sed -i 's/^SNMPTrapperFile.*/SNMPTrapperFile = \/var\/log\/snmptt\/snmptt.log/' /etc/zabbix/zabbix_server.conf
echo "StartSNMPTrapper=1" >> /etc/zabbix/zabbix_server.conf
```

```bash
nano /etc/snmp/snmptt.conf
```

```conf title="/etc/snmp/snmptt.conf"
EVENT general .* "General event" Normal
FORMAT ZBXTRAP $aA $1 $2 $3
```

```bash
nano /etc/snmp/snmptt.ini
```

```ini title="/etc/snmp/snmptt.ini"
mode = daemon
```

```bash
systemctl restart snmpd.service
systemctl restart snmptrapd.service
systemctl restart snmptt.service
systemctl restart zabbix-server.service
```

```bash
dnf install net-tools
netstat -tanu | grep :162
snmptrap -v 1 -c public 127.0.0.1 '.1.3.6.1.6.3.1.1.5.3' '0.0.0.0' 6 33 '55' .1.3.6.1.6.3.1.1.5.3 s "teststring000"
```

```bash
tail /var/log/snmptt/snmptt.log
```

```bash
nano /etc/zabbix/zabbix_server.conf
```

```conf title="/etc/zabbix/zabbix_server.conf"
SNMPTrapperFile = /var/log/snmptt/snmptt.log
StartSNMPTrapper=1
```

```bash
nano /etc/snmp/snmptrapd.conf
```

```conf title="/etc/snmp/snmptrapd.conf"
authCommunity log,execute,net public
# traphandle default snmptt
perl do "/usr/sbin/snmptthandler-embedded"
```

```bash
nano /etc/snmp/snmptt.ini
```

```ini title="/etc/snmp/snmptt.ini"
mode = daemon
date_time_format = %H:%M:%S %Y/%m/%d
log_enable = 1
log_file = /var/log/snmptt/snmptt.log
log_system_enable = 1
log_system_file = /var/log/snmptt/snmpttsystem.log
```

```bash
nano /etc/snmp/snmptt.conf
```

```conf title="/etc/snmp/snmptt.conf"
EVENT general .* "General event" Normal
FORMAT ZBXTRAP $aA $ar
```

## SNMPTT settings

```bash
/etc/snmp/snmptt.conf
```

```conf title="/etc/snmp/snmptt.conf"
EVENT general .1.3.6.1.4.1.9749.1.3.2.0.2 "ipDect Media Resource Busy (trap)" Warning
FORMAT ZBXTRAP $aA $1 $2 $3 $4 $5 $6
EVENT general .1.3.6.1.4.1.9749.1.3.2.0.4 "ipDect Media Resource Connection Lost (trap)" Warning
FORMAT ZBXTRAP $aA $1 $2 $3 $4 $5 $6
EVENT general .1.3.6.1.4.1.9749.1.3.2.0.1 "ipDect Registration Failed (trap)" Warning
FORMAT ZBXTRAP $aA $1 $2 $3 $4 $5 $6
EVENT general .1.3.6.1.4.1.9749.1.3.2.0.3 "ipDect Rfp Busy (trap)" Warning
FORMAT ZBXTRAP $aA $1 $2 $3 $4 $5 $6
EVENT general .1.3.6.1.4.1.9749.1.3.2.0.5 "ipDect Rfp Connection Lost (trap)" Warning
FORMAT ZBXTRAP $aA $1 $2 $3 $4 $5 $6
EVENT general .1.3.6.1.4.1.9749.1.3.2.0.6 "ipDect Rfp Sync Lost (trap)" Warning
FORMAT ZBXTRAP $aA $1 $2 $3 $4 $5 $6
```
