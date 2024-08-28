---
title: Embedding Grafana
---

For embedding Grafana in your application, you need to enable anonymous access and set the role to Viewer.

```bash
sudo nano /etc/grafana/grafana.ini
```

Check the following lines:

```ini title="/etc/grafana/grafana.ini"
allow_embedding = true
auth.anonymous
enabled = true
org_name = <<org name>>
org_role = Viewer
```

Save the file and restart Grafana.

```bash
sudo systemctl restart grafana-server
sudo systemctl status grafana-server
```
