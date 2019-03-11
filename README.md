<p align="center">
  <img 
    src="build/icon.png" 
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
  * Keyboard shortcuts

### Download &amp; Run Svalinn

#### Windows:
1. Download the latest installer here: https://github.com/ICONation/svalinn/releases/latest
2. Run the installer `Svalinn-<version>-win-setup.exe`.

#### macOS
1. Download latest archive here: https://github.com/ICONation/svalinn/releases/latest
2. Extract `Svalinn-<version>-mac.zip` and run `Svalinn.app` inside.

## Available keyboard shortcut

| Shortcut                                       | Target                               | Conditions |
| ---------                                      | -------                              | ---------- |
| <kbd>Ctrl</kbd>+<kbd>Home</kbd>                | Go to **overview/welcome** screen    | - |
| <kbd>Ctrl</kbd>+<kbd>Tab</kbd>                 | Go to **next tab/screen**            | - |
| <kbd>Ctrl</kbd>+<kbd>n</kbd>                   | Create new wallet                    | No wallet is being opened |
| <kbd>Ctrl</kbd>+<kbd>o</kbd>                   | Open a wallet                        | No wallet is being opened |
| <kbd>Ctrl</kbd>+<kbd>i</kbd>                   | Import wallet from private keys      | No wallet is being opened |
| <kbd>Ctrl</kbd>+<kbd>e</kbd>                   | Export private keys                  | Wallet is currently opened |
| <kbd>Ctrl</kbd>+<kbd>t</kbd>                   | Go to **Create Transaction** screen  | Wallet is currently opened |
| <kbd>Ctrl</kbd>+<kbd>s</kbd>                   | Go to **Send Transaction** screen    | Wallet is currently opened |
| <kbd>Ctrl</kbd>+<kbd>x</kbd>                   | Close currently opened wallet        | Wallet is currently opened |
| <kbd>Ctrl</kbd>+<kbd>d</kbd>                   | Toggle dark/night mode               | - |
| <kbd>Ctrl</kbd>+<kbd>/</kbd>                   | Display list of available shortcuts  | - |
| <kbd>Esc</kbd>                                 | Close any opened dialog              | - |

### Building/Packaging Svalinn


#### Windows

- Install Chocolatey : https://chocolatey.org/docs/installation

- Install Node (Admin Powershell/cmd) :

```console
choco install nodejs -y
```

- Install Git (Admin Powershell/cmd) :

```console
choco install git -y
```

- Restart a new Powershell/CMD window

- Download Svalinn source code :

```console
git clone https://github.com/iconation/Svalinn.git
cd Svalinn
```

- Build Svalinn :

```console
npm install
npm run debug
```

- Package Svalinn :

```console
npm run dist
```

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

- Package Svalinn :

```console
npm run dist
```
