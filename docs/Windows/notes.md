---
title: Scripts
---

## Run as user

```bat title="bat"
Set ApplicationPath="C:\Program Files\MyApp\testapp.exe"
cmd /min /C "set __COMPAT_LAYER=RUNASINVOKER && start "" %ApplicationPath%"
```

```reg title="reg"
[HKEY_CLASSES_ROOT\*\shell\forcerunasinvoker]
@="Run as user without UAC elevation"
[HKEY_CLASSES_ROOT\*\shell\forcerunasinvoker\command]
@="cmd /min /C \"set __COMPAT_LAYER=RUNASINVOKER && start \"\" \"%1\"\""
```

## Get interface network speed

```powershell title="powershell"
Get-WmiObject -ComputerName 'servername' -Class Win32_NetworkAdapter | `
    Where-Object { $_.Speed -ne $null -and $_.MACAddress -ne $null } | `
    Format-Table -Property SystemName,Name,NetConnectionID,Speed
```

## Disable auto lock

```bat title="bat"
powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_NONE CONSOLELOCK 0
```

## Disable Lock screen

```reg title="reg"
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Personalization]
"NoLockScreen"=dword:00000001
```

## List installed software with GUID

```powershell title="powershell"
get-wmiobject Win32_Product | Format-Table IdentifyingNumber, Name, LocalPackage -AutoSize
```

## Install HEVC

```bat title="bat"
REM HEVC Video Extensions from Device Manufacturer
ms-windows-store://pdp/?ProductId=9n4wgh0z6vhq
```

## Hyper-V replica status

```powershell title="powershell"
$replica = Get-VMReplication  | select Health
if ( $replica.Health -eq "Normal"){
      write-host 1
}elseif ( $replica.Health -eq "Critical"){
    write-host 2
}
```

## Fast startup

```bat title="bat"
:: Enable
REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Power" /V HiberbootEnabled /T REG_dWORD /D 0 /F
:: Disable
REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Power" /V HiberbootEnabled /T REG_dWORD /D 1 /F
```

## Enable RDP

```powershell title="powershell"
(Get-WmiObject Win32_TerminalServiceSetting -Namespace root\cimv2\TerminalServices).SetAllowTsConnections(1,1)
(Get-WmiObject -Class "Win32_TSGeneralSetting" -Namespace root\cimv2\TerminalServices -Filter "TerminalName='RDP-tcp'").SetUserAuthenticationRequired(1)
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

## Enable Linked connections

```powershell title="powershell"
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" -Name "EnableLinkedConnections" -Value ”00000001”
```

## Display timeout 15 minutes

```bat title="bat"
powercfg /CHANGE -monitor-timeout-ac 15
powercfg /CHANGE -monitor-timeout-dc 15
```

## Disable power off button

```reg title="reg"
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Winlogon\Notifications\Components\GPClient]
"Events"="CreateSession,Logon,Logoff,StartShell,EndShell"
"Friendly Name"="Group Policy Service"
"ServiceName"="gpsvc"
```

## Disable timeout remote registry service

```bat title="bat"
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\RemoteRegistry" /v DisableIdleStop /t REG_DWORD /d 00000001 /f
```

or

```reg title="reg"
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\RemoteRegistry]
"DisableIdleStop"=dword:00000001
```

## Deploy Bginfo

```powershell title="powershell"
Copy-Item -Path "\\server\distr$\Users\bginfo" -Destination "C:\Windows" -Recurse
New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name "BGInfo" -Value ”C:\\WINDOWS\\Bginfo.exe c:\\WINDOWS\\bginfo.bgi /NOLICPROMPT /TIMER:0”  -PropertyType "String"
```

## Delete WSUS Server

```bat title="bat"
Reg Delete HKLM\Software\Policies\Microsoft\Windows\WindowsUpdate /v WUServer /f
Reg Delete HKLM\Software\Policies\Microsoft\Windows\WindowsUpdate /v WUStatusServer /f
```

## Delete 30 days old files

```powershell title="powershell"
$limit = (Get-Date).AddDays(-30)
$path = "\\server\logs"

# Delete files older than the $limit.
Get-ChildItem -Path $path -Recurse -Force | Where-Object { !$_.PSIsContainer -and $_.CreationTime -lt $limit } | Remove-Item -Force

# Delete any empty directories left behind after deleting the old files.
Get-ChildItem -Path $path -Recurse -Force | Where-Object { $_.PSIsContainer -and (Get-ChildItem -Path $_.FullName -Recurse -Force | Where-Object { !$_.PSIsContainer }) -eq $null } | Remove-Item -Force -Recurse
```

## Show computer name for user

```powershell title="powershell"
Add-Type -AssemblyName System.Windows.Forms
$ip=get-WmiObject Win32_NetworkAdapterConfiguration|Where {$_.Ipaddress.length -gt 1} 
$ipaddress = $ip.ipaddress[0]
$pcname = [System.Net.Dns]::GetHostName()
[System.Windows.Forms.MessageBox]::Show("Имя компьютера: $pcname `n`nIP адрес: $ipaddress",'Имя компьютера','OK','Information')
```

## Find event ID

```powershell title="powershell"
# Set the log file name and location
$logFile = "C:\Windows\System32\Winevt\Logs\Microsoft-Windows-OfflineFiles%4Operational.evtx"

# Set the date range for event log search
$startDate = (Get-Date).AddDays(-7)
$endDate = Get-Date

# Get the events from the OfflineFiles log with Event ID 2006
$events = Get-WinEvent -FilterHashtable @{LogName="Microsoft-Windows-OfflineFiles/Operational";StartTime=$startDate;EndTime=$endDate;ID=2006}

# If events are found, output to log file
if($events) {
#    $events | Select-Object TimeCreated, Message | Out-File $logFile
    Write-Host "sync errors found"
} else {
    Write-Host "sync errors not found"
}
```

## Disable hibernation

```bat title="bat"
powercfg -h off
powercfg -setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
```

## Enable autologin

```reg title="reg"
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon]
"AutoAdminLogon"="1"
"DefaultUserName"="user"
"DefaultDomainName"="domain"
"DefaultPassword"="password"
```

## Add Active Directory group to local administrators group

```powershell title="powershell"
# Specify the name of the Active Directory group
$adGroupName = "Group Name"
$domain = "domain"

# Specify the name of the local group
$localGroup = "Administrators"

# Get the name of the local computer
$computerName = $env:localhost

# Get the SID of the Active Directory group
$adGroup = Get-ADGroup -Identity $adGroupName
$adGroupSid = $adGroup.SID.Value

# Get the local administrators group
$localGroupName = [ADSI]"WinNT://$computerName/$localGroup,group"

# Get users in local group
$members = Get-LocalGroupMember -Group $localGroup | ForEach-Object { $_.GetType().InvokeMember("Name", 'GetProperty', $null, $_, $null) }

# Check Active Directory group in local group
if ($members -contains "$domain\$adGroupName") {
    Write-Host "$adGroupName is member of $localGroupName."
} else {
    Write-Host "$adGroupName is not member of $localGroupName."

    # Add the Active Directory group to the local administrators group
    Add-LocalGroupMember -Group $localGroup -Member $adGroupSid
}
```

## Create NAT for Hyper-V

```powershell title="powershell"
New-VMSwitch -Name VirtualNetwork -SwitchType Internal
New-NetIPAddress –IPAddress 10.0.1.254 -PrefixLength 24 -InterfaceAlias “vEthernet (VirtualNetwork)”
New-NetNat -Name VirtualNetworkOutside -InternalIPInterfaceAddressPrefix 10.0.1.0/24
Get-NetNat
```

## Uptime computers from list

```powershell title="powershell"
$servers = @(
    "Server1",
    "Server2",
    "Server3"
)

foreach ($server in $servers) {
    $wmi = Get-WmiObject -Class Win32_OperatingSystem -ComputerName $server
    $lastBootUpTime = [Management.ManagementDateTimeConverter]::ToDateTime($wmi.LastBootUpTime)
    $uptime = (Get-Date) - $lastBootUpTime

    Write-Output "Server: $server, Uptime: $uptime"
}
```
