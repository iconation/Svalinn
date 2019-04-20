// Dictionary object format
// "language-label": {
//    "#element-id": { 
//      "text": "text content here",
//      "tag": false, // [false, true]
//      "title": "text content of title tag",
//      "placeholder": "text content of placeholder tag",
//      }
// }
//
let tempDict = {
  "en-US": {
    // src/html/welcome.html
    "#welcome-text-1": {
      "text": `Welcome!`,
      "tag": false,
    },
    "#welcome-text-2": {
      "text": `Get started by creating a new wallet,<br> open or import your existing wallet.`,
      "tag": false,
    },
    "#welcome-text-3": {
      "text": `Open wallet`,
      "tag": true,
      "title": "Open your existing wallet file (ctrl+o)"
    },
    "#welcome-text-4": {
      "text": `Create New Wallet`,
      "tag": true,
      "title": "Create new wallet file (ctrl+n)"
    },
    "#welcome-text-5": {
      "text": `Import key`,
      "tag": true,
      "title": "Import/restore your private keys (ctrl+i)"
    },
    // src/html/about.html
    "#about-text-1": {
      "text": `<p>This is a GUI front-end to manage ICX assets (ICX).</p><p>You can use this software to create and import new ICX wallets, or open existing wallets. Then you can manage your wallet, such as viewing your balance and transactions history, sending/transferring ICX, etc.</p>`,
      "tag": false
    },
    "#about-text-2": {
      "text": `Donate to: <strong>ICONation</strong>`,
      "tag": false
    },
    "#about-text-3": {
      "text": false,
      "tag": true,
      "title": "Click to copy"
    },
    "#about-text-4": {
      "text": `Source codes, release notes, documentations & bugs tracker can be found at our Github repo:<br> <a tabindex="0" class="external" href="https://github.com/ICONation/svalinn">https://github.com/ICONation/svalinn</a>`,
      "tag": false
    },
    // src/html/address_book_add.html
    "#address-add-text-1": {
      "text": `Add Address Book Entry`,
      "tag": false
    },
    "#address-add-text-2": {
      "text": `Name`,
      "tag": false
    },
    "#address-add-text-3": {
      "text": false,
      "tag": true,
      "placeholder": "Required, give a unique name/label to make it easy to identify...",
    },
    "#address-add-text-4": {
      "text": "Wallet Address",
      "tag": false
    },
    "#address-add-text-5": {
      "text": false,
      "tag": true,
      "placeholder": "Required, a valid ICX address, non unique address is allow as long as it have different payment id...",
    },
    "#address-add-text-6": {
      "text": 'Save',
      "tag": false
    },
    "#address-add-text-7": {
      "text": 'Back',
      "tag": false
    },
    // src/html/address_book.html
    "#address-book-text-1": {
      "text": "Address Book",
      "tag": false
    },
    "#address-book-text-2": {
      "text": "Search",
      "tag": false
    },
    "#address-book-text-3": {
      "text": false,
      "tag": true,
      "placeholder": "Search by name or wallet address"
    },
    "#address-book-text-4": {
      "text": "Select address book",
      "tag": false
    },
    "#address-book-text-5": {
      "text": "Default/Built-in Address Book",
      "tag": false
    },
    "#address-book-text-6": {
      "text": false,
      "tag": true,
      "title": "Create new address book"
    },
    "#address-book-text-7": {
      "text": "Add New Entry",
      "tag": false
    },
    "#address-book-text-8": {
      "text": "Back",
      "tag": false,
    },
    // src/html/create_transaction.html
    "#create-text-1": {
      "text": 'Create ICX transaction',
      "tag": false
    },
    "#create-text-2": {
      "text": 'Wallet password',
      "tag": false
    },
    "#create-text-3": {
      "text": false,
      "tag": true,
      "placeholder": "Password to open this wallet..."
    },
    "#create-text-4": {
      "text": 'Recipient address',
      "tag": false
    },
    "#create-text-5": {
      "text": false,
      "tag": true,
      "placeholder": "Required, a valid ICX address..."
    },
    "#create-text-6": {
      "text": 'Type one or more characters to search from address book, or type new address.',
      "tag": false
    },
    "#create-text-7": {
      "text": 'Amount (ICX)',
      "tag": false
    },
    "create-text-8": {
      "text": false,
      "tag": true,
      "title": "Required, amount of ICX you want to send."
    },
    "#create-text-9": {
      "text": 'Step Limit (step)',
      "tag": false
    },
    "#create-text-10": {
      "text": false,
      "tag": true,
      "title": "Required, step price is paiid in loop and 1 loop is fixed to 0.000000000000000001 (10^18) ICX. ICON transaction fee is imposed according to various factors such as the number of smart contract usage, the amount of blockchain database used and the size of transaction data, etc"
    },
    "#create-text-11": {
      "text": 'Select where the transaction file will be stored',
      "tag": false
    },
    "#create-text-12": {
      "text": false,
      "tag": true,
      "placeholder": "Required, full path to store this transaction..."
    },
    "#create-text-13": {
      "text": 'Select network',
      "tag": false
    },
    "#create-text-14": {
      "text": 'Mainnet',
      "tag": false
    },
    "#create-text-15": {
      "text": 'Testnet for Exchanges (Euljiro)',
      "tag": false
    },
    "#create-text-16": {
      "text": 'Testnet for DApps (Yeouido)',
      "tag": false
    },
    "#create-text-17": {
      "text": 'Create',
      "tag": false
    },
    "#create-text-18": {
      "text": 'Back',
      "tag": false
    },
    // src/html/index.html
    "#index-text-1": {
      "text": "Svalinn - ICONation ICX Wallet",
      "tag": false
    },
    "#index-text-2": {
      "text": false,
      "tag": true,
      "title": "Wallet Overview"
    },
    "#index-text-2-1": {
      "text": "Wallet",
      "tag": false
    },
    "#index-text-3": {
      "text": false,
      "tag": true,
      "title": "Address Book"
    },
    "#index-text-4": {
      "text": 'Address Book',
      "tag": false
    },
    "#index-text-5": {
      "text": false,
      "tag": true,
      "title": "Create transaction"
    },
    "#index-text-6": {
      "text": 'Create transaction',
      "tag": false
    },
    "#index-text-7": {
      "text": false,
      "tag": true,
      "title": "Send transaction"
    },
    "#index-text-8": {
      "text": 'Send transaction',
      "tag": false
    },
    "#index-text-9": {
      "text": false,
      "tag": true,
      "title": "Language"
    },
    "#index-text-10": {
      "text": false,
      "tag": true,
      "title": "About"
    },
    "#index-text-11": {
      "text": false,
      "tag": true,
      "title": "Show keyboard shorcut"
    },
    "#index-text-12": {
      "text": false,
      "tag": true,
      "title": "Switch to dark mode"
    },
    // src/html/overview_create.html
    "#overview-create-text-1": {
      "text": 'Create new wallet',
      "tag": false
    },
    "#overview-create-text-2": {
      "text": 'Select where the wallet file will be stored',
      "tag": false
    },
    "#overview-create-text-3": {
      "text": false,
      "tag": true,
      "placeholder": "Required, full path to store this wallet..."
    },
    "#overview-create-text-4": {
      "text": 'Set password to open this wallet',
      "tag": false
    },
    "#overview-create-text-5": {
      "text": false,
      "tag": true,
      "placeholder": "Required, set a password to open your new wallet..."
    },
    "#overview-create-text-6": {
      "text": 'Create',
      "tag": false
    },
    "#overview-create-text-7": {
      "text": 'Cancel',
      "tag": false
    },
    // src/html/overview.html
    "#overview-text-1": {
      "text": 'Address:',
      "tag": false
    },
    "#overview-text-2": {
      "text": false,
      "tag": true,
      "title": "click to copy"
    },
    "#overview-text-3": {
      "text": 'Balance:',
      "tag": false
    },
    "#overview-text-4": {
      "text": false,
      "tag": true,
      "title": "Available Balance"
    },
    "#overview-text-5": {
      "text": 'Select network',
      "tag": false
    },
    "#overview-text-6": {
      "text": 'Mainnet',
      "tag": false
    },
    "#overview-text-7": {
      "text": 'Testnet for Exchanges (Euljiro)',
      "tag": false
    },
    "#overview-text-8": {
      "text": 'Testnet for DApps (Yeouido)',
      "tag": false
    },
    "#overview-text-9": {
      "text": 'Backup Keys',
      "tag": true,
      "title": "Backup your private keys (ctrl+e)"
    },
    "#overview-text-10": {
      "text": 'Close',
      "tag": true,
      "title": "Close current wallet, so you can open another wallet (ctrl+x)"
    },
    // src/html/overview_import_key.html
    "#overview-import-text-1": {
      "text": 'Import Private Key',
      "tag": false
    },
    "#overview-import-text-2": {
      "text": 'Select where the wallet file will be stored',
      "tag": false
    },
    "#overview-import-text-3": {
      "text": false,
      "tag": true,
      "placeholder": "Required, full path to store this wallet..."
    },
    "#overview-import-text-4": {
      "text": 'Set password to open this wallet',
      "tag": false
    },
    "#overview-import-text-5": {
      "text": false,
      "tag": true,
      "title": "Required",
      "placeholder": "Required, set a password to open this wallet..."
    },
    "#overview-import-text-6": {
      "text": 'Private key to be imported',
      "tag": false
    },
    "#overview-import-text-7": {
      "text": false,
      "tag": true,
      "placeholder": "Required, your private view key to be imported..."
    },
    "#overview-import-text-8": {
      "text": 'Import',
      "tag": false
    },
    "#overview-import-text-9": {
      "text": 'Cancel',
      "tag": false
    },
    // src/html/overview_load.html
    "#overview-load-text-1": {
      "text": 'Open a wallet',
      "tag": false
    },
    "#overview-load-text-2": {
      "text": 'Select the wallet file',
      "tag": false
    },
    "#overview-load-text-3": {
      "text": false,
      "tag": true,
      "placeholder": "Full path to the wallet file to be opened..."
    },
    "#overview-load-text-4": {
      "text": 'Open',
      "tag": false
    },
    "#overview-load-text-5": {
      "text": 'Back',
      "tag": false
    },
    // src/html/overview_show.html
    "#overview-show-text-1": {
      "text": '',
      "tag": false
    },
    // src/html/send_transaction.html
    "#send-text-1": {
      "text": '',
      "tag": false
    },
    // src/html/shortcuts.html
    "#shortcuts-text-1": {
      "text": '',
      "tag": false
    },
    // src/html/splash.html
    "#splash-text-1": {
      "text": '',
      "tag": false
    },
  },
  "es-VE": {
    ".welcome-intro-title": `Bienvenido!`,
    ".welcome-intro": `Inicia creando una nueva billetera,<br> Abre o importa tu billetera.`,
    "#button-welcome-openwallet": `Abrir billetera`,
    "#button-welcome-createwallet": `Crear nueva billetera`,
    "#button-welcome-import-key": `Importar llave`
  }
}



function createDictionary(dictInfo) {
  // In order to not repeat the language objects info over and over, this functions creates the dictionary that is going to be exported
  let langList = Object.keys(dictInfo);
  let defaultLang = "en-US";
  let elementList = Object.keys(dictInfo[defaultLang]);
  let langObj  = {};

  // Making a deep copy of dictInfo[defaultLang]
  langObj[defaultLang] = JSON.parse(JSON.stringify(dictInfo[defaultLang]));
  for (let lang of langList) {
    if (lang !== defaultLang) {
      langObj[lang] = JSON.parse(JSON.stringify(dictInfo[defaultLang]));
      for (let element of elementList) {
        langObj[lang][element]['text'] = 'TRANSLATION NEEDED';
      }
    }
  }
  return langObj;
}

// TESTING
if (typeof require != 'undefined' && require.main == module) {
  let foo = createDictionary(tempDict);
  for (let i of Object.keys(foo)) {
    console.log(i);
    for (let ii of Object.keys(foo[i])) {
      console.log(`    ${ii}`);
      for (let iii of Object.keys(foo[i][ii])) {
        console.log(`        ${iii}: ${foo[i][ii][iii]}`);
      }
    }
  }
}
