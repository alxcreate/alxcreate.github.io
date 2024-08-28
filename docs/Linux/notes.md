---
title: Linux notes
---


## Change SWAP size

1. Turn off all running swap processes: `swapoff -a`
2. Resize swap `fallocate -l 1G /swapfile` (change 1G to the gigabyte size you want it to be)
3. CHMOD swap: `chmod 600 /swapfile`
4. Make file usable as swap `mkswap /swapfile`
5. Active the swap file `swapon /swapfile`

To verify your swap size run the following command and you will see the swap size: `free -m`

## Copy key to remote host

```bash
scp -i ~/.ssh/id_rsa user@10.0.0.1:.ssh/id_rsa
```

## Change user password

```bash
sudo passwd username
```

## Login via SSH with password

```bash
sudo nano /etc/ssh/sshd_config
```

```conf
PasswordAuthentication yes/no 
AllowUsers jenkins
```

```bash
sudo systemctl restart sshd
```

## Add host to known hosts

```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

## Show where the command is located and add to PATH

```bash
which molecule
echo $PATH 
export PATH=$PATH:/path/to/molecule 
```

## Add user to sudoers

```bash
sudo nano /etc/sudoers
```

## Add ssh key for system

```bash
chmod 600 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa
```

## Add admin for system

```bash
useradd -m -s /bin/bash admin
passwd admin
usermod -aG wheel admin
visudo
```

## Git configuration for user

```bash
git config --global user.email "email@domain.com"
git config --global user.name "username"
```

## Install xrdp

```bash
sudo yum install xrdp xorgxrdp
Uncomment [Xorg] in /etc/xrdp/xrdp.ini
sudo firewall-cmd --add-port=3389/tcp
sudo firewall-cmd --runtime-to-permanent
sudo systemctl start xrdp
sudo systemctl enable xrdp
```

## Install FTP

```bash
sudo apt update
sudo apt install vsftpd
sudo systemctl start vsftpd
sudo systemctl enable vsftpd
sudo useradd -m testuser
sudo passwd testuser
sudo ufw allow 20/tcp
sudo ufw allow 21/tcp
sudo mkdir /srv/ftp/new_location
sudo usermod -d /srv/ftp/new_location ftp
sudo systemctl restart vsftpd.service
sudo nano /etc/vsftpd.conf
```

```conf title="/etc/vsftpd.conf"
write_enable=YES
```

```bash
sudo systemctl restart vsftpd.service
```

```conf
chroot_local_user=YES
chroot_list_file=/etc/vsftpd.chroot_list
```
