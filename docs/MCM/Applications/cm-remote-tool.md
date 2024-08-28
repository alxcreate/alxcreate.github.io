---
title: CM Remote Tool
---



## Files

Installer:

```powershell
#Software name
$SoftName = "CmRcViewer"

#Define OS architecture
if([Environment]::Is64BitOperatingSystem) {
#If x64
$ProgFiles = ${env:ProgramFiles(x86)}
$Reg = "HKLM:\SOFTWARE\WOW6432Node"
$RegCmRcViewer = "$Reg\Microsoft\Windows\CurrentVersion\Uninstall\CmRcViewer"
} else {
#If x32
$ProgFiles = ${env:ProgramFiles}
$Reg = "HKLM:\SOFTWARE"
$RegCmRcViewer = "$Reg\Microsoft\Windows\CurrentVersion\Uninstall\CmRcViewer"
}
$FileUninstallString = "$ProgFiles\CmRcViewer\Uninstall\uninstall.ps1"

#Copy files in Program Files
New-Item -ItemType Directory "$ProgFiles\CmRcViewer"
Expand-Archive "\\server\CmRcViewer\5.0.9049.1000\CmRcViewer.zip" "$ProgFiles\CmRcViewer"
#Create registry items for manual uninstall
New-Item -Path "$Reg\Microsoft\Windows\CurrentVersion\Uninstall" -Name "CmRcViewer"
New-ItemProperty -Path $RegCmRcViewer -Name "DisplayName" -Value ”CmRcViewer”  -PropertyType "String"
New-ItemProperty -Path $RegCmRcViewer -Name "InstallLocation" -Value ”$ProgFiles\CmRcViewer”  -PropertyType "String"
New-ItemProperty -Path $RegCmRcViewer -Name "UninstallString" -Value "powershell -File `"$FileUninstallString`""  -PropertyType "String"
New-ItemProperty -Path $RegCmRcViewer -Name "EstimatedSize" -Value ”0x000025be”  -PropertyType "DWORD"
New-ItemProperty -Path $RegCmRcViewer -Name "Publisher" -Value ”CmRcViewer”  -PropertyType "String"
New-ItemProperty -Path $RegCmRcViewer -Name "DisplayVersion" -Value ”20.5”  -PropertyType "String"
New-ItemProperty -Path $RegCmRcViewer -Name "DisplayIcon" -Value ”$ProgFiles\CmRcViewer\Uninstall\CmRcViewer.ico”  -PropertyType "String"
New-ItemProperty -Path $RegCmRcViewer -Name "HelpLink" -Value ”https://docs.microsoft.com/en-us/mem/configmgr/core/clients/manage/remote-control/remotely-administer-a-windows-client-computer”  -PropertyType "String"
New-ItemProperty -Path $RegCmRcViewer -Name "ProductFamily" -Value ”CmRcViewer”  -PropertyType "String"
New-ItemProperty -Path $RegCmRcViewer -Name "NoModify" -Value ”0x00000001”  -PropertyType "DWORD"
New-ItemProperty -Path $RegCmRcViewer -Name "NoRepair" -Value ”0x00000001”  -PropertyType "DWORD"
$ProgFiles = ${env:ProgramFiles(x86)}

#Create shotcut in Start Menu
$ShortcutFile = "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\CmRcViewer.lnk"
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($ShortcutFile)
$Shortcut.TargetPath = "$ProgFiles\CmRcViewer\CmRcViewer.exe"
$Shortcut.Save()

#Create shotcut on Desktop
$ShortcutFile = "C:\Users\Public\Desktop\CmRcViewer.lnk"
$Shortcut = $WScriptShell.CreateShortcut($ShortcutFile)
$Shortcut.TargetPath = "$ProgFiles\CmRcViewer\CmRcViewer.exe"
$Shortcut.Save()
```

Uninstaller:

```powershell
Stop-Process -name "CmRcViewer" -Force -ErrorAction Ignore
#Wait for process stopping
Start-Sleep -Seconds 1

#Define OS architecture
if([Environment]::Is64BitOperatingSystem) {
#If x64
$ProgFiles = ${env:ProgramFiles(x86)}
$Reg = "HKLM:\SOFTWARE\WOW6432Node"
} else {
#If x32
$ProgFiles = ${env:ProgramFiles}
$Reg = "HKLM:\SOFTWARE"
}
$RegCmRcViewer = "$Reg\Microsoft\Windows\CurrentVersion\Uninstall\CmRcViewer"

#Remove files
Remove-Item $ProgFiles"\CmRcViewer" -Recurse -Force
#Remove items for manual uninstall
Remove-Item -Path "$RegCmRcViewer"
#Remove shortcuts
Remove-Item -Path "C:\Users\Public\Desktop\CmRcViewer.lnk" -ErrorAction Ignore
Remove-Item -Path "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\CmRcViewer.lnk" -ErrorAction Ignore
```

- For create package need run script:

```powershell
$PathAdminConsole="C:\Program Files (x86)\ConfigMgr Console\bin\i386"
$CurrentLocation=Get-Location
$compress = @{
LiteralPath= "$PathAdminConsole\CmRcViewer.exe", "$PathAdminConsole\RdpCoreSccm.dll", "$PathAdminConsole\00000409\", "$CurrentLocation\Uninstall"
CompressionLevel = "Fastest"
DestinationPath = "$CurrentLocation\CmRcViewer.zip"
}
Compress-Archive @compress
```

- It will create archive CmRcViewer.zip. It should be moved to `\\server\CmRcViewer\5.0.9049.1000` (version is specified as the version of the file `CmRcViewer.exe`)
- Script `install.ps1` starts the installation. It should be copied to `\\server\CmRcViewer\5.0.9049.1000` after changing the version in the line:

```powershell
Expand-Archive "\\server\CmRcViewer\5.0.9049.1000\CmRcViewer.zip" "$ProgFiles\CmRcViewer"
```

- Add app in SCCM

For access to remote computer need open ports:

- TCP 135
- UDP 2702
- TCP 2702
- UDP 2701
- TCP 2701

Link for remote access `"C:\Program Files (x86)\CmRcViewer\CmRcViewer.exe" HOSTNAME`
