---
title: OSD
---

## Links

[Using Microsoft Deployment Toolkit (MDT) UDI as Custom OSD Frontend in Microsoft SCCM](https://www.youtube.com/watch?v=UREhjeKM-TM)

[NIC 4th Edition - OS Deployment at LEVEL 500](https://www.youtube.com/watch?v=u7dA1uZrrVo\&list=PLVYxL4mCN8gIUIgqg6wiWwpsCbRvpdxch)

## ESD to WIM

- Монтировать ISO образ. Получить список версий внутри образа

```bat
dism /Get-WimInfo /WimFile:h:\sources\install.esd
```

Экспортировать нужную версию указав соответствующий **SourceIndex**

```bat
dism /export-image /SourceImageFile:e:\sources\install.esd /SourceIndex:1 /DestinationImageFile:C:\Temp\Windows10_21H2_OEM_EN_x64.wim /Compress:max /CheckIntegrity
```

- Если файл в формате `.wim`, то можно использовать один файл для использования установки разных версий;
- Полученные файлы `.wim` копировать в каталог на сервере SCCM `%DeployRoot%\OS\Image`;
- В консоли **CM** добавить образ в **Operating System Images**;
- Выполнить распространение каждого добавленного образа на точку распространения **CM**;
- Добавляется в UDI.

## Language

`MDT_Setting\Unattend.xml`

You need to change the following lines in the **oobeSystem** section of the **unattend.xml** file.

```xml title="Unattend.xml"
<InputLocale>%Keyboardlocale%</InputLocale>
<SystemLocale>%InputLocale%</SystemLocale>
<UILanguage>%UILanguage%</UILanguage>
<UserLocale>%Inputlocale%</UserLocale>
```
