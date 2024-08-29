---
title: Bginfo
---

## Файлы приложения

Файлы для распространения через SCCM. Во вложенной директории `Bginfo` находятся файлы приложения, которые копируются в каталог `C:\Program Files\Bginfo` на рабочем месте пользователя.

Действие в планировщике:

```bat
C:\Windows\System32\wscript.exe "C:\Program Files\Bginfo\start_conf2.vbs"
```

Установка приложения:

```bat
@echo off
if not exist "%~1" md "%~1"
xcopy /y /c "%~dp0Bginfo\*.*" "%~1"
schtasks.exe /create /tn "BginfoStart" /xml "%~dp0BginfoStart.xml" /f
```

Удаление приложения:

```bat
rd /s /q "%~1"
schtasks /delete /tn BginfoStart /f
```

Запуск приложения планировщиком:

```vbs
Option Explicit
Dim WshShell
Set WshShell = CreateObject("WScript.Shell")

Dim currentValue
currentValue = WshShell.RegRead("HKCU\Control Panel\Colors\Background")

Dim rgbValues
rgbValues = Split(currentValue, " ")

If rgbValues(0) >= 200 And rgbValues(1) >= 200 And rgbValues(2) >= 200 Then
WshShell.RegWrite "HKCU\Control Panel\Colors\Background", "81 92 107", "REG_SZ"
End If

WshShell.Run """C:\Program Files\BGInfo\BGInfo64.exe"" ""C:\Program Files\BGInfo\conf-workstation.bgi"" /timer:0 /NOLICPROMPT", 0, False

Set WshShell = Nothing
```

## Обновление конфигурации Bginfo для SCCM

Пример перехода с версии `4.32.0.1` на `4.32.0.2`.

- Создать копию каталога изменив в имени последнее число версии `\\<sevrername>\Deploy_<sitecode>\Application\Microsoft\Microsoft_Bginfo_4.32.0.1` (`Microsoft_Bginfo_4.32.0.2`);
- При необходимости заменить файл `conf-workstation.bgi` на новый с тем же именем;
- При необходимости заменить файл `start_conf1.vbs` на новый с новым именем `start_conf2.vbs`;
- Если файл `start_conf1.vbs` не заменялся, то переименовать существующий на `start_conf2.vbs`;
- В файле `BginfoStart.xml` изменить в строке ссылку на файл заменив в имени число на новое

```xml
<Arguments>"C:\Program Files\Bginfo\start_conf2.vbs"</Arguments>
```

- Скопировать существующее приложение в SCCM **Microsoft Bginfo 4.32.0.1**
- Изменить в новой копии **Deployment Type**
  - Изменить номер версии в имени `4.32.0.2`;
  - Изменить номер версии в Content Location `4.32.0.2`;
  - Изменить в методе обнаружения имя `start_conf1.vbs` на новое `start_conf2.vbs`.
- Изменить **Application**
  - Изменить номер версии в имени `4.32.0.2`;
  - Изменить номер версии `4.32.0.2`;
  - Изменить **Supersedence** на обновление последней версии, поставить галочку **Uninstall**;
- Распространить на тестовую коллекцию, проверить работу. Затем на основную **DSWR Microsoft Bginfo**.
- При деплое **Purpose** выбрать **Required**, поставить галочку **Software Installation**.
