---
title: ClickOnce
---

## Silent Install

Use SilentClickOnce.exe and commands:

Install example:

```bat
SilentClickOnce.exe -i "\\servername\apps\MyApp\MyApp.application"
```

Uninstall example:

```bat
SilentClickOnce.exe -u MyApp
```

## Detection Script

```powershell
$filename = 'app.exe'
$currentVersion = '1.2.3.4'
$regHive = 'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\'
$regKey = 'DisplayName'
$regValue = 'app'

# Find file
$localAppData = [System.Environment]::GetFolderPath('LocalApplicationData')
$directory = $localAppData + '\Apps\2.0'
$file = Get-ChildItem -Path $directory -Recurse -Filter $filename

# Find registry key
$regKeys = Get-ChildItem -Path $regHive -Recurse | Where-Object { $_.GetValue($regKey) -eq $regValue }
$regVersion = $regKeys | ForEach-Object { $_.GetValue('DisplayVersion') }

# If file exist and version = currentVersion then write "installed"
if ($file -ne $null -and $regVersion -eq $currentVersion) {
    Write-Host 'installed'
}
```
