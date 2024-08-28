---
title: Install Windows
---

## Bypass Windows 11 requirements during installation

At the beginning of the Windows 11 installation, press **Shift+F10** and enter `regedit` in **cmd**. Go to the `HKEY_LOCAL_MACHINE\SYSTEM\Setup` branch. Create **LabConfig** directory and **DWORD** keys inside:

- `BypassTPMCheck` = 1
- `BypassRAMCheck` = 1
- `BypassSecureBootCheck` = 1

## Bypass Windows 11 network requirement during installation

At the beginning of the Windows 11 installation, press **Shift+F10** and enter `OOBE\BYPASSNRO` in **cmd**. It will reboot and you can continue the installation without the Internet.
