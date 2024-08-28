---
title: Other
---

## WSUS Server in Registry

`HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate`

- WUServer: `http://srv:8530`
- WUStatusServer: `http://srv:8530`

## Revoke Update

Example

```bat
DISM.exe /Online /Remove-Package /PackageName:Package_for_RollupFix~31bf3856ad364e35~amd64~~19041.867.1.8 /quiet /norestart
```

## Import update to WSUS

[Script from Microsoft](https://learn.microsoft.com/en-us/windows-server/administration/windows-server-update-services/manage/wsus-and-the-catalog-site?branch=pr-4097#powershell-script-to-import-updates-into-wsus)

