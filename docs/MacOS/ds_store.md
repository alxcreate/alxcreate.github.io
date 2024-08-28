---
title: .DS_Store files
---

Disable creation of .DS_Store files on network volumes:

```bash
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool TRUE
```

log out and back in to apply changes.

Check current policy:

```bash
defaults read com.apple.desktopservices
# Output:
DSDontWriteNetworkStores = 1
```

To revert the changes, enter:

```bash
defaults delete com.apple.desktopservices DSDontWriteNetworkStores
```
