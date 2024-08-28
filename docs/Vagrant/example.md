---
title: Vagrantfile
---

This is a template for creating a Vagrantfile for creating multiple VMs.

## VirtualBox

```ruby title="Vagrantfile"
Vagrant.configure("2") do |config|
  config.vm.provider :libvirt do |libvirt|
    libvirt.driver = "kvm"
  end
  
  (1..3).each do |i|
    config.vm.define "server#{i}" do |node|
      node.vm.box = "generic/alpine38"
      node.vm.provider :libvirt do |libvirt|
        libvirt.memory = 1024
        libvirt.cpus = 1
      end
      
      node.vm.network :private_network, ip: "192.168.33.#{i}"
      
      node.ssh.insert_key = true  # Включение импорта ключа SSH
      config.vm.provision "shell", inline: <<-SHELL
        cat /home/<username>/.ssh/id_rsa.pub >> /home/vagrant/.ssh/authorized_keys
      SHELL            
      node.vm.provision "shell", inline: <<-SHELL
        # Дополнительные команды настройки, если требуется
      SHELL
    end
  end
end
```

## Hyper-V

```ruby title="Vagrantfile"
Vagrant.configure("2") do |config|
  # Определение мастер-ноды
  config.vm.define "master" do |node|
    node.vm.box = "ubuntu/focal64"
    node.vm.provider :virtualbox do |vb|
      vb.memory = 2048
      vb.cpus = 2
      vb.customize ["modifyvm", :id, "--nic1", "hostonly", "--hostonlyadapter1", "VirtualBox Host-Only Ethernet Adapter"]
    end
    node.vm.network "private_network", ip: "192.168.10.10"
    node.ssh.insert_key = true
    node.ssh.private_key_path = "id_rsa"
  end

  # Определение worker-нод
  (1..4).each do |i|
    config.vm.define "worker#{i}" do |node|
      node.vm.box = "ubuntu/focal64"
      node.vm.provider :virtualbox do |vb|
        vb.memory = 1024
        vb.cpus = 1
        vb.customize ["modifyvm", :id, "--nic1", "hostonly", "--hostonlyadapter1", "VirtualBox Host-Only Ethernet Adapter"]
      end
      node.vm.network "private_network", ip: "192.168.1.#{10 + i}"
      node.ssh.insert_key = true
      node.ssh.private_key_path = "id_rsa"
    end
  end
end
```

## VMWare

```ruby title="Vagrantfile"
Vagrant.configure("2") do |config|
  config.vm.box = "my-box"
  config.vm.provider "vmware_desktop" do |v|
    v.gui = true
  end
end
```
