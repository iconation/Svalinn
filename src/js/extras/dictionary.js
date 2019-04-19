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
      "text": '',
      "tag": false
    },
    // src/html/overview_create.html
    "#overview-create-text-1": {
      "text": '',
      "tag": false
    },
    // src/html/overview.html
    "#overview-text-1": {
      "text": '',
      "tag": false
    },
    // src/html/overview_import_key.html
    "#overview-import-text-1": {
      "text": '',
      "tag": false
    },
    // src/html/overview_load.html
    "#overview-load-text-1": {
      "text": '',
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
