<p align="center">
  <img 
    src="https://iconation.team/images/very_small.png" 
    width="120px"
    alt="ICONation logo">
</p>

<h1 align="center">Svalinn - GUI wallet for ICON</h1>

<p align="center">
  <img 
    src="https://i.imgur.com/l5fpalj.png"
    width="500px"
    alt="Svalinn Screens">
</p>

 [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

### Features:

This wallet contains the basic functions required to manage your ICX assets:

* Wallet creation:
  * Create new wallet.
  * Import/recover from private keys.
* Basic wallet operation/transactions:
  * Open an existing wallet
  * Display wallet address & balance
  * Display & Backup private keys
  * Sending/transfering. Also provides address lookup from your addressbook.
* Address book:
  * Add/Edit/Delete address entry.
  * Listing/sorting/searching existing entries.
  * Allow to optionally create password protected address book.
* Misc:
  * Theme: Dark & Light Mode
  * [Keyboard shortcuts](docs/shortcut.md)

### Download &amp; Run Svalinn

#### Windows:
1. Download the latest installer here: https://github.com/ICONation/svalinn/releases/latest
2. Run the installer (`svalinn-<version>-win-setup.exe`) and follow the installation wizard.
3. Launch Svalinn via start menu or desktop shortcut.

#### GNU/Linux (AppImage):
1. Download latest AppImage bundle here: https://github.com/ICONation/svalinn/releases/latest
2. Make it executable, either via GUI file manager or command line, e.g. `chmod +x svalinn-<version>-linux.AppImage`
3. Run/execute the file, double click in file manager, or run via shell/command line (See: https://docs.appimage.org/user-guide/run-appimages.html)

#### macOS
1. Download latest archive here: https://github.com/ICONation/svalinn/releases/latest
2. Extract downloaded zip archived
3. Run the executable binary (`Svalinn.app/Contents/MacOs/Svalinn`)

### Building/Packaging Svalinn

#### macOS

- Install XCode : 
https://itunes.apple.com/us/app/xcode/id497799835?mt=12

- Install Homebrew : 

```console
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

- Install Node :

```console
brew install node
```

- Install Git :

```console
brew install git
```

- Download Svalinn source code :

```console
git clone https://github.com/iconation/Svalinn.git && cd Svalinn
```

- Build Svalinn :

```console
npm install && npm run debug
```

