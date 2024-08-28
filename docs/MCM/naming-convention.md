---
title: Naming Convention
---

## File and Folder Naming

### Deployment Share

```
​​​​​​​📁 Deploy_<SiteCode> (\\<sevrername>\Deploy_<sitecode>)
    📁 Application
        📁 <Manufacturer>
            📁 <Manufacturer>_<Product>_<Version>
                📁 <PV>_<Language>_<Architecture>
                📁 <ConfigurationName>_<PV>_<Language>_<Architecture>
    📁 Driver
        📁 Package
            📁 <HardwareManufacturer>_<HardwareModel>_<WinVersion>_<Architecture>_<PackageVersion> (WinVersion=Win7/Win10)
        📁 Source (Исходные файлы драйверов для импорта)
            📁 <Category> (LAN/WWAN/WLAN/CHIPSET/DISPLAY/CAMERA/SOL/GRAPHIC/RAID/AUDIO/MEI/FIRMWARE/OTHERS)
                📁 <HardwareManufacturer>_<HardwareModel>_<WinVersion>_<Architecture>_<Version>​​​​​​​
    📁 OS
        📁 WinPE
            💿 Custom_<Version>_<Architecture>.wim
        📁 Image
            💿 <OS><Edition>_<Version>_<Configuration>_<Language>_<Architecture>.wim
            💿 Source_<OS><Edition>_<Version>_<Configuration>_<Language>_<Architecture>.wim
    📁 SoftwarePackage
        📁 <Category> (BIOS, Configuration, Tools, Scripts)
            📁 <Manufacturer>_<Name>_<Version>_<Language>_<Architecture>_<PackageVersion>
    📁 SoftwareUpdate
        📁 Package
            📁 <Year>-<S1S2>
            📁 EndpointProtection
        📁 Source (Свои собственные обновления Windows для SCUP)
            📁 <Manufacturer>
                📁 <Manufacturer>_<Product>_<Version>_<Language>_<Architecture>_<PackageVersion>
```

## Object Naming

### Applications

```
💾 Applications
    📁 <Manufacturer>
        💾 Name - <Manufacturer> <Product> <Version>
        Manufacturer - <Manufacturer>
        Software Version - <Version>
        Localized Display Name - <Product> (Допускается добавление пробелов)
            💾 Deployment Type Name - <Manufacturer> <Product> <Version> - <Configuration> <PV> <Language> <Architecture>
```

### Packages

```
💽 Packages
    📁 <Category> (Папки категорий как в Deployment Share (Firmware, Drivers, Scripts)
        💽 Name - <Product>
        Version - <Version>
        Manufacturer - <Manufacturer>
        Language - <Language> <Architecture>
```

### WIM Files

```
💽 Operating System Images
    📁 <OS><Edition>
        💽 Name - <OS><Edition> <Version> <Configuration> <Language> <Architecture>
            <Version>
```

### Task Sequences

```
💽 Task Sequences
    📁 OSD (Разворачивание ОС)
        💽 <Manufacturer> <OS><Edition> <Configuration> <Language> <Architecture>
    📁 OSI (Создание .wim файлов)
        💽 OSI <Manufacturer> <OS><Edition> <Configuration> <Language> <Architecture>
    📁 OSU (Обновление ОС Windows (feature upgrade))
        💽 <Manufacturer> <OS><Edition> <Configuration> <Language> <Architecture>
    📁 Dev (Тестирование инженерами)
        💽 DEV <Manufacturer> <OS><Edition> <Configuration> <Language> <Architecture>
```

Удалите пробелы и нижние подчеркивания в значениях Manufacturer и Product. Эти символы используются как разделители.

* Manufacturer - Производитель. Не используйте разное написание одного производителя. Если не указан или Opensource, то используется “Others”.
* Product - Имя продукта (Office, Photoshop и т.д.). Маркетинговый номер версии "2019" или "X" пишется слитно.
* Version - Номер версии продукта в формате 0.0.0.0, 0.0.0 или 0.0. Не используйте маркетинговый номер версии "2019" или "X" и т.п.
* P or V - Физические и виртуальные пакеты (APP-V) Указывается тип в типах развертывания.
* Language - Язык из двух символов: RU, EN, DE, FR и т.д. Мультиязычные - ML.
* Architecture - Архитектура (arm64/x64/x86/x99).
* Configuration - Описание конфигурации используется при необходимости.
* OS - ОС (Windows7, Windows11 и т.д.).
* Edition - Редакция ОС (Home, Pro, Ent, Edu, Mlt)

### Collection Naming

```
🧑🏼‍💻 User Collections
    📁 Development (Для тестов)
        🧑🏼‍💻 <Prefix> <Name>
    📁 Software
        📁 Required Software
            📁 <Manufacturer>
                🧑🏼‍💻 USWR <Manufacturer> <SoftwareName>
                🧑🏼‍💻 USWR <Manufacturer> <SoftwareName> <LIFECYCLESTATE>
                🧑🏼‍💻 USWR <Manufacturer> <SoftwareName> Uninstall
        📁 Available Software
            📁 <Manufacturer>
                🧑🏼‍💻 USWA <Manufacturer> <SoftwareName>
                🧑🏼‍💻 USWA <Manufacturer> <SoftwareName> <LIFECYCLESTATE>
        📁 Required Profile
            🧑🏼‍💻 USPR <ProfileName>
        📁 Available Software
            🧑🏼‍💻 USPA <ProfileName>
   📁 Settings Management (Правила соответствия Compliance)
        🧑🏼‍💻 USM <Name>
```

* Prefix - Функциональное назначение
* LIFECYCLESTATE - Pilot, TST, INT и т.д.
* ProfileName - HR, Marketing и т.д.

```
🖥 Device Collections
    📁 Development (Для тестов)
        🖥 <Prefix> <Name>
    📁 Windows Defender
        🖥 WD <PolicyName>
    📁 Software
        📁 Required Software
            📁 <Manufacturer>
                🖥 DSWR <Manufacturer> <SoftwareName>
                🖥 DSWR <Manufacturer> <SoftwareName> <LIFECYCLESTATE>
                🖥 DSWR <Manufacturer> <SoftwareName> Uninstall
        📁 Available Software
            📁 <Manufacturer>
                🖥 DSWA <Manufacturer> <SoftwareName>
                🖥 DSWA <Manufacturer> <SoftwareName> <LIFECYCLESTATE>
        📁 Required Profile
            🖥 DSPR <ProfileName>
        📁 Available Profile
            🖥 DSPA <ProfileName>
    📁 Settings Management (Правила соответствия Comliance)
        🖥 SM <Name>
    📁 Client Settings (Настройки агента SCCM)
        🖥 CS <Name>
    📁 Power Management
        🖥 PM <Name>
    📁 Software Updates
        🖥 SUM <Type> Pilot 1 (Тестирование)
        🖥 SUM <Type> Prod (Эксплуатация)
        🖥 SUM Excluded (Исключаемые из всех SUM)
        🖥 SUM <Type> Manual (Ручная установки, без дедлайна)
    📁 Maintenance Windows
        🖥 MW <Name>
    📁 Operating System Deployment
        🖥 OSD <TSName>( Последовательности задач установки ОС) 
        🖥 OSU <TSName> (Последовательности задач обновления ОС) 
    📁 Operating System Imaging
        🖥 OSI <TSName> (Создание образов операционных систем (файл .wim))
```

* Type - SRV (сервер) или CLN (клиент)
* TSName - Соответствует имени последовательности задач.
