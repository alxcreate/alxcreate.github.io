---
title: Install
---

## Hard way

[Kubernetes the hard way](https://github.com/kelseyhightower/kubernetes-the-hard-way)

GUI tool [Lens](https://k8slens.dev/)

## Ansible

```yaml title="inventory.yml"
all:
  children:
    kubernetes_servers:
      hosts:
        server1:
          ansible_host: 192.168.33.1
          ansible_user: user
        server2:
          ansible_host: 192.168.33.2
          ansible_user: user
        server3:
          ansible_host: 192.168.33.3
          ansible_user: user
#    database_servers:
#      hosts:
#        db_server1:
#          ansible_host: 192.168.33.4
#        db_server2:
#          ansible_host: 192.168.33.5
```

```yaml title="playbook-kube.yaml"
---
- name: Install and configure Kubernetes cluster
  hosts: kubernetes_servers
  become: true
  vars:
    kube_version: 1.21.2
    pod_network_cidr: 10.244.0.0/16
  tasks:
    - name: Install Docker
      apt:
        name: docker.io
        state: present

    - name: Install Kubernetes packages
      apt:
        name: ['kubelet', 'kubeadm', 'kubectl']
        state: present
        update_cache: true

    - name: Initialize Kubernetes cluster on the control plane node
      command: kubeadm init --pod-network-cidr={{ pod_network_cidr }}
      args:
        creates: /etc/kubernetes/admin.conf
      register: kubeadm_output

    - name: Set up kubeconfig for the user
      command: mkdir -p $HOME/.kube && cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
      args:
        creates: $HOME/.kube/config
      become: false
      environment:
        HOME: "{{ ansible_env.HOME }}"
        USER: "{{ ansible_env.USER }}"

    - name: Deploy Pod network
      command: kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
      args:
        creates: /etc/kubernetes/manifests/kube-flannel.yml

    - name: Allow scheduling Pods on the control plane node
      command: kubectl taint nodes --all node-role.kubernetes.io/master-
      when: kubeadm_output.stdout_lines is search("This node has the role 'master'.")

    - name: Generate join command for worker nodes
      command: kubeadm token create --print-join-command
      changed_when: false
      register: join_command
      when: kubeadm_output.stdout_lines is search("Your Kubernetes control-plane has initialized successfully")

    - name: Print join command for worker nodes
      debug:
        var: join_command.stdout_lines

    - name: Join worker nodes to the cluster
      command: "{{ item }}"
      loop: "{{ join_command.stdout_lines[1:] }}"
      when: kubeadm_output.stdout_lines is search("Your Kubernetes control-plane has initialized successfully")
```
