---
title: Molecule
---

Molecule is designed to aid in the development and testing of Ansible roles. Molecule provides support for testing with multiple instances, operating systems and distributions, virtualization providers, test frameworks and testing scenarios. Molecule encourages an approach that results in consistently developed roles that are well-written, easily understood and maintained.

https://github.com/ansible/molecule

```bash
## Init new role with driver and script for test
molecule init role --driver-name <driver> <rolename>
# Init new scenario for test with driver
molecule init scenario --driver-name <driver> <scenarioname>
# Start full scenario for test
molecule test
# Start full scenario for test without destroying infrastructure
molecule test --destroy=never
# Define steps matrix for start task in all scenarios
molecule matrix <taskname>
# Define steps matrix for start task in defined scenario
molecule matrix -s <scenarioname> <taskname>
# Start task for test
molecule <taskname>
```

Drivers for create environment for tests: docker, podman (containers), delegate (clouds)

```bash
# Create directory for role
molecule init role namespace:role_name --driver-name docker
# Create test scenario
molecule init scenario default --driver-name docker
```

Define in file `molecule/default/molecule.yml` platform for test:

```yml
lint: | 
ansible-lint . 
yamllint . 
platforms: 
- name: centos7 
image: docker.io/pycontribs/centos:7 
pre_build_image: true 
```

## Change testing order

`molecule.yml`

```yml title="molecule/default/molecule.yml"
scenario: 
test_sequence: 
- destroy 
- create 
- ... 
```

## Check matrix steps

```bash
molecule matrix test
```
