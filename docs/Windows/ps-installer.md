---
title: Powershell Installer
---

## Install

```powershell title="install.ps1"
$Manufacturer = "Manufacturer"
$AppName = "$App Name"
$exeFile = "AppName"

# Define OS architecture
if([Environment]::Is64BitOperatingSystem) {
    # If x64
    $ProgFiles = ${env:ProgramFiles(x86)}
    $Reg = "HKLM:\SOFTWARE\WOW6432Node"
    $RegPath = "$Reg\Microsoft\Windows\CurrentVersion\Uninstall\$AppName"
}
else {
    # If x32
    $ProgFiles = ${env:ProgramFiles}
    $Reg = "HKLM:\SOFTWARE"
    $RegPath = "$Reg\Microsoft\Windows\CurrentVersion\Uninstall\$AppName"
}
$FileUninstallString = "$ProgFiles\$AppName\Uninstall\uninstall.ps1"

# Copy files in Program Files
Expand-Archive "\\server\Apps\$AppName.zip" $ProgFiles
# Create registry items for manual uninstall
New-Item -Path "$Reg\Microsoft\Windows\CurrentVersion\Uninstall" -Name $AppName
New-ItemProperty -Path $RegPath -Name "DisplayName" -Value $AppName  -PropertyType "String"
New-ItemProperty -Path $RegPath -Name "InstallLocation" -Value "$ProgFiles\$AppName"  -PropertyType "String"
New-ItemProperty -Path $RegPath -Name "UninstallString" -Value "powershell -File `"$FileUninstallString`""  -PropertyType "String"
New-ItemProperty -Path $RegPath -Name "EstimatedSize" -Value "0x000025be"  -PropertyType "DWORD"
New-ItemProperty -Path $RegPath -Name "Publisher" -Value $Manufacturer  -PropertyType "String"
New-ItemProperty -Path $RegPath -Name "DisplayVersion" -Value "20.5"  -PropertyType "String"
New-ItemProperty -Path $RegPath -Name "DisplayIcon" -Value "$ProgFiles\$AppName\Uninstall\$Manufacturer.ico"  -PropertyType "String"
New-ItemProperty -Path $RegPath -Name "HelpLink" -Value "https://app-name.com"  -PropertyType "String"
New-ItemProperty -Path $RegPath -Name "ProductFamily" -Value $AppName  -PropertyType "String"
New-ItemProperty -Path $RegPath -Name "NoModify" -Value "0x00000001"  -PropertyType "DWORD"
New-ItemProperty -Path $RegPath -Name "NoRepair" -Value "0x00000001"  -PropertyType "DWORD"
$ProgFiles = ${env:ProgramFiles(x86)}

# Create shortcut in Start Menu
$ShortcutFile = "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\$AppName.lnk"
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($ShortcutFile)
$Shortcut.TargetPath = "$ProgFiles\$AppName\$exeFile"
$Shortcut.Save()

# Create shortcut on Desktop
$ShortcutFile = "C:\Users\Public\Desktop\$AppName.lnk"
$Shortcut = $WScriptShell.CreateShortcut($ShortcutFile)
$Shortcut.TargetPath = "$ProgFiles\$AppName\$exeFile"
$Shortcut.Save()
```

## Uninstall

```powershell title="uninstall.ps1"
$Manufacturer = "Manufacturer"
$AppName = "App Name"
$exeFile = "AppName"

Stop-Process -name $exeFile -Force -ErrorAction Ignore
# Remove autostart item
Remove-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name $exeFile -ErrorAction Ignore
# Wait for process stopping
Start-Sleep -Seconds 1

# Define OS architecture
if([Environment]::Is64BitOperatingSystem) {
    # If x64
    $ProgFiles = ${env:ProgramFiles(x86)}
    $Reg = "HKLM:\SOFTWARE\WOW6432Node"
}
else {
    # If x32
    $ProgFiles = ${env:ProgramFiles}
    $Reg = "HKLM:\SOFTWARE"
    $RegPath = "$Reg\Microsoft\Windows\CurrentVersion\Uninstall\$AppName"
}

# Remove files
Remove-Item $ProgFiles"\$AppName" -Recurse -Force
# Remove items for manual uninstall
Remove-Item -Path "$Reg\Microsoft\Windows\CurrentVersion\Uninstall\$AppName"
# Remove shortcuts
Remove-Item -Path "C:\Users\Public\Desktop\$AppName.lnk" -ErrorAction Ignore
Remove-Item -Path "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\$AppName.lnk" -ErrorAction Ignore
```
