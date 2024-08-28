---
title: Settings
---


## TFTP Settings for PXE Boot

Edit registry on server with PXE Distribution Point.

- Path: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\SMS\DP`
- Type: `REG_DWORD`
- RamDiskTFTPBlockSize - package size; Default `4096` (`16384` max)
- RamDiskTFTPWindowSize - package count; Default `4`

Optimal size for MTU. Example, 1450.

## Указание переменных перед установкой ОС через PXE

Открываем свойства коллекции **All Unknown Computers** и на вкладке **Collection Variables** добавляем переменные (напр. `OSDComputerName`)
