/*jshint bitwise: false*/
/* global AbortController */
const os = require('os');
const path = require('path');
const fs = require('fs');
const superagent = require('superagent');
const { clipboard, remote, ipcRenderer, shell } = require('electron');
const Store = require('electron-store');
const Mousetrap = require('./extras/mousetrap.min.js');
const autoComplete = require('./extras/auto-complete');
const wsutil = require('./ws_utils');
const SvalinnSession = require('./ws_session');
const SvalinnManager = require('./ws_manager');
const config = require('./ws_config');
const AgGrid = require('ag-grid-community');
const wsmanager = new SvalinnManager();
const sessConfig = { debug: remote.app.debug, walletConfig: remote.app.walletConfig };
const wsession = new SvalinnSession(sessConfig);
const settings = new Store({ name: 'Settings' });
const SvalinnAddressbook = require('./ws_addressbook');

const ADDRESS_BOOK_DIR = remote.app.getPath('userData');
const ADDRESS_BOOK_DEFAULT_PATH = path.join(ADDRESS_BOOK_DIR, '/SharedAddressBook.json');
let addressBook = new SvalinnAddressbook(ADDRESS_BOOK_DEFAULT_PATH);

const win = remote.getCurrentWindow();
const Menu = remote.Menu;
const WS_VERSION = settings.get('version', 'unknown');
const DEFAULT_WALLET_PATH = remote.app.getPath('documents');
const DEFAULT_TRANSACTION_PATH = remote.app.getPath('documents');
const WALLET_REFRESH_INTERVAL = 4 * 1000;

let refreshWalletWorker;

let WALLET_OPEN_IN_PROGRESS = false;

//FidelVe: import dictionary
const _DICT_ = require('./extras/dictionary').dictionary;

/*  dom elements vars; */
// main section link
let sectionButtons;
// generics
let genericBrowseButton;
let genericFormMessage;
let genericEnterableInputs;
let genericEditableInputs;
let firstTab;
// settings page
let settingsInputServiceBin;
let settingsInputMinToTray;
let settingsInputCloseToTray;
let settingsInputExcludeOfflineNodes;
let settingsInputTimeout;
let settingsButtonSave;
// overview page
let overviewWalletAddress;
let overviewWalletCloseButton;
let overviewWalletRescanButton;
let overviewPaymentIdGen;
let overviewIntegratedAddressGen;
let showkeyButtonRevealKey;
let overviewNetworkId;
// addressbook page
let addressBookInputName;
let addressBookInputWallet;
let addressBookInputPaymentId;
let addressBookInputUpdate;
let addressBookButtonSave;
// new abook
let addressBookButtonAdd;
let addressBookSelector;
// open wallet page
let walletOpenInputPath;
let createTransactionWalletPassword;
let walletOpenButtonOpen;
let walletOpenButtons;
let createTransactionNodeNetwork;
let walletOpenNodeLabel;
let walletOpenSelectBox;
let walletOpenSelectOpts;
let walletOpenAddCustomNode;
let walletOpenRefreshNodes;
// show/export keys page
let showkeyButtonExportKey;
let showkeyInputViewKey;
let showkeyInputSpendKey;
let showkeyInputSeed;
// send page
let createTransactionRecipientAddress;
let createTransactionIcxAmount;
let sendInputPaymentId;
let createTransactionStepLimit;
let createTransactionButtonCreate;
let sendTransactionButtonSend;
let createTransactionTxFile;
let sendTransactionTxFile;
let transactionHash;
let sendOptimize;
// create wallet
let createWalletButtonCreate;
let createWalletPath;
// let walletCreateInputFilename;
let createWalletPassword;
// import wallet keys
let importKeyButtonImport;
let importKeyInputPath;
// let importKeyInputFilename;
let importKeyInputPassword;
let importKeyInputViewKey;
let importKeyInputSpendKey;
let importKeyInputScanHeight;
// import wallet seed
let importSeedButtonImport;
let importSeedInputPath;
//let importSeedInputFilename;
let importSeedInputPassword;
let importSeedInputMnemonic;
let importSeedInputScanHeight;
// transaction
let txButtonSortDate;
// misc
let thtml;
let dmswitch;
let kswitch;
let iswitch;

//added by FidelVe delete from here
let _LANG_;

ipcRenderer.on('change-lang', (event, langSelected) => {
  translateApp(langSelected);
});

function showLangSelection() {
  // Popup with the language options
  ipcRenderer.send('select-lang');
}

function translateApp(selectedLanguage) {
  //this functions takes all the text elements on the app and translate them depending on the language selected by the user

  //taking the text elements from the DOM
  let textElements = [ 
    ['.welcome-intro-title'], ['.welcome-intro'], ['#button-welcome-openwallet'], ['#button-welcome-createwallet'], ['#button-welcome-import-key']
  ];
  for (let each of textElements) {
    //Getting the text DOM elements
    let element = document.querySelector(each[0]);
    //Changing the innerHTML content of each text element based on theselected language
    element.innerHTML = _DICT_[selectedLanguage][each[0]];
   };
}
//added by FidelVe delete to here

function populateElementVars()
{
    // Misc
    thtml = document.documentElement;
    dmswitch = document.getElementById('tswitch');
    kswitch = document.getElementById('kswitch');
    iswitch = document.getElementById('button-section-about');
    firstTab = document.querySelector('.navbar-button');
    //added by FidelVe delete from here
    _LANG_ = document.getElementById('button-lang');
    //added by FidelVe delete to here


    // Generics
    genericBrowseButton = document.querySelectorAll('.path-input-button:not(.d-opened');
    genericFormMessage = document.getElementsByClassName('form-ew');
    genericEnterableInputs = document.querySelectorAll('.section input:not(.noenter)');
    genericEditableInputs = document.querySelectorAll('textarea:not([readonly]), input:not([readonly]');

    // Main section link
    sectionButtons = document.querySelectorAll('[data-section]');

    // Overview pages
    overviewWalletAddress = document.getElementById('wallet-address');
    overviewWalletCloseButton = document.getElementById('button-overview-closewallet');
    overviewPaymentIdGen = document.getElementById('payment-id-gen');
    overviewIntegratedAddressGen = document.getElementById('integrated-wallet-gen');
    overviewWalletRescanButton = document.getElementById('button-overview-rescan');
    overviewNetworkId = document.getElementById('overview-network-id');
    
    // Address Book page
    addressBookInputName = document.getElementById('input-addressbook-name');
    addressBookInputWallet = document.getElementById('input-addressbook-wallet');
    addressBookInputPaymentId = document.getElementById('input-addressbook-paymentid');
    addressBookInputUpdate = document.getElementById('input-addressbook-update');
    addressBookButtonSave = document.getElementById('button-addressbook-save');
    addressBookButtonAdd = document.getElementById('addAddressBook');
    addressBookSelector = document.getElementById('addressBookSelector');

    // Create Transaction page
    createTransactionWalletPassword = document.getElementById('create-transaction-wallet-password');
    createTransactionRecipientAddress = document.getElementById('create-transaction-recipient-address');
    createTransactionIcxAmount = document.getElementById('create-transaction-icx-amount');
    createTransactionStepLimit = document.getElementById('create-transaction-step-limit');
    createTransactionTxFile = document.getElementById('create-transaction-txfile');
    createTransactionNodeNetwork = document.getElementById('create-transaction-node-network');
    createTransactionButtonCreate = document.getElementById('button-create-transaction-create');

    // open wallet page
    walletOpenInputPath = document.getElementById('input-load-path');
    overviewShowPassword = document.getElementById('overview-show-password');
    walletOpenButtonOpen = document.getElementById('button-load-load');
    walletOpenButtons = document.getElementById('walletOpenButtons');
    walletOpenNodeLabel = document.getElementById('fake-selected-node');
    walletOpenSelectBox = document.getElementById('fake-select');
    walletOpenSelectOpts = document.getElementById('fakeNodeOptions');
    walletOpenAddCustomNode = document.getElementById('addCustomNode');
    walletOpenRefreshNodes = document.getElementById('updateNodeList');

    // show/export keys page
    showkeyButtonRevealKey = document.getElementById('button-show-reveal');
    showkeyButtonExportKey = document.getElementById('button-show-export');
    showkeyInputViewKey = document.getElementById('key-show-view');
    showkeyInputSpendKey = document.getElementById('key-show-spend');
    showkeyInputSeed = document.getElementById('seed-show');

    // Send Transaction page
    sendTransactionTxFile = document.getElementById('send-transaction-txfile');
    sendTransactionHiddenTxHash = document.getElementById('send-transaction-hidden-txhash');
    sendTransactionTxHash = document.getElementById('send-transaction-txhash');
    sendTransactionButtonSend = document.getElementById('button-send-transaction-send');

    // Create wallet
    createWalletButtonCreate = document.getElementById('button-create-wallet-create');
    createWalletPath = document.getElementById('create-wallet-path');
    createWalletPassword = document.getElementById('create-wallet-password');

    // Import wallet keys
    importKeyButtonImport = document.getElementById('button-import-import');
    importKeyInputPath = document.getElementById('input-import-path');
    importKeyInputPassword = document.getElementById('input-import-password');
    importKeyInputViewKey = document.getElementById('key-import-view');
    importKeyInputSpendKey = document.getElementById('key-import-spend');
    importKeyInputScanHeight = document.getElementById('key-import-height');
}

function initSectionTemplates()
{
    const importLinks = document.querySelectorAll('link[rel="import"]');
    for (var i = 0; i < importLinks.length; i++) {
        let template = importLinks[i].import.getElementsByTagName("template")[0];
        let templateString = template.innerHTML;
        let templateNode = document.createRange().createContextualFragment(templateString);
        let clone = document.adoptNode(templateNode);
        document.getElementById('main-div').appendChild(clone);
    }
    // once all elements in place, safe to populate dom vars
    populateElementVars();
}

// utility: dark mode
function setDarkMode(dark)
{
    let tmode = dark ? 'dark' : '';
    thtml.classList.add('transit');
    if (tmode === 'dark') {
        thtml.classList.add('dark');
        dmswitch.setAttribute('title', 'Leave dark mode');
        dmswitch.firstChild.classList.remove('fa-moon');
        dmswitch.firstChild.classList.add('fa-sun');
        settings.set('darkmode', true);
        dmswitch.firstChild.dataset.icon = 'sun';
    } else {
        thtml.classList.remove('dark');
        dmswitch.setAttribute('title', 'Switch to dark mode');
        dmswitch.firstChild.classList.remove('fa-sun');
        dmswitch.firstChild.classList.add('fa-moon');
        settings.set('darkmode', false);
        dmswitch.firstChild.dataset.icon = 'moon';
    }
    setTimeout(function () {
        thtml.classList.remove('transit');
    }, 2000);
}

function showKeyBindings()
{
    let dialog = document.getElementById('ab-dialog');
    if (dialog.hasAttribute('open')) dialog.close();
    let shortcutstInfo = document.getElementById('shortcuts-main').innerHTML;
    let keybindingTpl = `
        <div class="transaction-panel">${shortcutstInfo}
            <span title="Close this dialog (esc)" class="dialog-close dialog-close-default" data-target="#ab-dialog"><i class="fas fa-window-close"></i></span>
        </div>`;
    dialog.innerHTML = keybindingTpl;
    dialog.showModal();
}

function checkUpdate ()
{
    superagent.get('https://api.github.com/repos/iconation/svalinn/releases/latest').end((err, res) => {
        if (!err && res) {
            let result = JSON.parse (res.text);
            let tag = result.tag_name;
            if (settings.get('version') != tag)
            {
                wsutil.showToast ('A new version of Svalinn is available (' + tag + ') ! '
                            +     'Checkout <a href="#" class="dont-color-link" id="go-latest-release-github">https://github.com/iconation/svalinn</a>', 
                            20 * 1000);
                            
                dialog = document.getElementById('belekok');
                let goLatestRelease = dialog.querySelector ('#go-latest-release-github');

                goLatestRelease.addEventListener('click', (event) => {
                    shell.openExternal ('https://github.com/iconation/Svalinn/releases/latest');
                });
            }
        }
    });
}

function showAbout()
{
    let dialog = document.getElementById('ab-dialog');
    if (dialog.hasAttribute('open')) dialog.close();
    let infoContent = document.querySelector('.about-main').innerHTML;
    let info = `
        <div class="transaction-panel">
            ${infoContent}
            <span title="Close this dialog (esc)" class="dialog-close dialog-close-default" data-target="#ab-dialog"><i class="fas fa-window-close"></i></span>
        </div>`;
    dialog.innerHTML = info;
    dialog.showModal();
}

function switchTab()
{
    if (WALLET_OPEN_IN_PROGRESS) {
        wsutil.showToast('Opening wallet in progress, please wait...');
        return;
    }
    let isServiceReady = wsession.get('serviceReady') || false;
    let activeTab = document.querySelector('.btn-active');
    let nextTab = activeTab.nextElementSibling || firstTab;
    let nextSection = nextTab.dataset.section.trim();
    let skippedSections = [];
    if (!isServiceReady) {
        skippedSections = ['section-create-transaction', 'section-send-transaction'];
        if (nextSection === 'section-overview') nextSection = 'section-welcome';
    }

    while (skippedSections.indexOf(nextSection) >= 0) {
        nextTab = nextTab.nextElementSibling;
        nextSection = nextTab.dataset.section.trim();
    }
    changeSection(nextSection);
}

// section switcher
function changeSection(sectionId, targetRedir)
{
    wsutil.showToast('');

    if (WALLET_OPEN_IN_PROGRESS) {
        wsutil.showToast('Opening wallet in progress, please wait...');
        return;
    }

    targetRedir = targetRedir === true ? true : false;
    let targetSection = sectionId.trim();

    let isServiceReady = wsession.get('serviceReady') || false;
    let needServiceReady = ['section-create-transaction', 'section-overview'];
    let needServiceStopped = 'section-welcome';

    let origTarget = targetSection;
    let finalTarget = targetSection;
    let toastMsg = '';

    if (needServiceReady.includes(targetSection) && !isServiceReady) {
        // no access to wallet, send, tx when no wallet opened
        finalTarget = 'section-welcome';
        let notoast = finalTarget.concat(['section-overview']);
        if (!notoast.includes(origTarget)) {
            toastMsg = "Please create or open your wallet first !";
        }
    } else if (needServiceStopped.includes(targetSection) && isServiceReady) {
        finalTarget = 'section-overview';
    } else {
        finalTarget = targetSection;
        toastMsg = '';
    }

    let section = document.getElementById(finalTarget);
    if (section.classList.contains('is-shown')) {
        if (toastMsg.length && !targetRedir) wsutil.showToast(toastMsg);
        return;
    }

    // reset quick filters
    if (finalTarget === 'section-addressbook' && window.ABOPTSAPI) {
        window.ABOPTSAPI.api.setQuickFilter('');
    }

    // navbar active section indicator, only for main section
    let finalButtonTarget = (finalTarget === 'section-welcome' ? 'section-overview' : finalTarget);
    let newActiveNavbarButton = document.querySelector(`.navbar button[data-section="${finalButtonTarget}"]`);
    if (newActiveNavbarButton) {
        const activeButton = document.querySelector(`.btn-active`);
        if (activeButton) activeButton.classList.remove('btn-active');
        if (newActiveNavbarButton) newActiveNavbarButton.classList.add('btn-active');
    }

    // toggle section
    formMessageReset();
    const activeSection = document.querySelector('.is-shown');
    if (activeSection) activeSection.classList.remove('is-shown');
    section.classList.add('is-shown');
    section.dispatchEvent(new Event('click')); // make it focusable

    // show msg when needed
    if (toastMsg.length && !targetRedir) wsutil.showToast(toastMsg);
    // notify section was changed
    let currentButton = document.querySelector(`button[data-section="${finalButtonTarget}"]`);
    if (currentButton) {
        wsmanager.notifyUpdate({
            type: 'sectionChanged',
            data: currentButton.getAttribute('id')
        });
    }
}

// generic form message reset
function formMessageReset() {
    if (!genericFormMessage.length) return;
    for (var i = 0; i < genericFormMessage.length; i++) {
        genericFormMessage[i].classList.add('hidden');
        wsutil.clearChild(genericFormMessage[i]);
    }
}

function formMessageSet(target, status, txt) {
    // clear all msg
    formMessageReset();
    let the_target = `${target}-${status}`;
    let the_el = null;
    try {
        the_el = document.querySelector('.form-ew[id$="' + the_target + '"]');
    } catch (e) { }

    if (the_el) {
        the_el.classList.remove('hidden');
        wsutil.innerHTML(the_el, txt);
    }
}

// display initial page, settings page on first run, else overview page
function showInitialPage() {
    // other initiations here
    formMessageReset();
    changeSection('section-welcome');
    let versionInfo = document.getElementById('svalinnVersion');
    if (versionInfo) versionInfo.innerHTML = WS_VERSION;
}

// address book completions
function initAddressCompletion(data) {
    var addresses = [];
    if (data) {
        addresses = Object.entries(data).map(([k, v]) => `${v.name}###${v.address}###${v.paymentId ? v.paymentId : ''}`);
    }

    try {
        if (window.COMPLETION_ADDRBOOK) window.COMPLETION_ADDRBOOK.destroy();
    } catch (e) {
        // console.log(e);
    }

    window.COMPLETION_ADDRBOOK = new autoComplete({
        selector: 'input[id="create-transaction-recipient-address"]',
        minChars: 1,
        cache: false,
        source: function (term, suggest) {
            term = term.toLowerCase();
            var choices = addresses;
            var matches = [];
            for (var i = 0; i < choices.length; i++)
                if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
            suggest(matches);
        },
        renderItem: function (item, search) {
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            var spl = item.split("###");
            var wname = spl[0];
            var waddr = spl[1];
            var wpayid = spl[2];
            return `<div class="autocomplete-suggestion" data-paymentid="${wpayid}" data-val="${waddr}">${wname.replace(re, "<b>$1</b>")}<br><span class="autocomplete-wallet-addr">${waddr.replace(re, "<b>$1</b>")}</span></div>`;
        },
        onSelect: function (e, term, item) {
        }
    });
}
function updateAddressBookSelector(selected) {
    selected = selected || null;
    if (!selected) {
        let ab = wsession.get('addressBook');
        if (ab) selected = ab.path;
    }
    if (!selected || selected.endsWith('SharedAddressBook.json')) {
        selected = 'default';
    } else {
        selected = path.basename(selected);
    }

    let knownAb = settings.get('address_books', []);
    // update addressbook selector
    addressBookSelector.options.length = 0;
    let abopts = document.createElement('option');
    abopts.value = 'default';
    abopts.text = 'Default/Built-in Address Book';
    abopts.setAttribute('selected', 'selected');
    addressBookSelector.add(abopts, null);
    knownAb.forEach((v) => {
        let abpath = path.join(ADDRESS_BOOK_DIR, v.filename);
        if (wsutil.isFileExist(abpath)) {
            let opt = document.createElement('option');
            opt.text = v.name;
            opt.value = v.filename;
            opt.dataset.name = v.name;
            if (v.filename === selected) {
                abopts.removeAttribute('selected');
                opt.setAttribute('selected', 'selected');
            }
            addressBookSelector.add(opt, null);
        }
    });
    addressBookSelector.value = selected;
}

function handleAddressBook() {
    function migrateOldFormat(newBook) {
        let oldAddressBook = path.join(remote.app.getPath('userData'), 'AddressBook.json');
        fs.access(oldAddressBook, fs.constants.F_OK | fs.constants.W_OK, (err) => {
            if (err) {
                return newBook;
            } else {
                const oldBook = new Store({
                    name: 'AddressBook',
                    encryptionKey: config.addressBookObfuscateEntries ? config.addressBookObfuscationKey : null
                });
                let addressBookData = newBook.data;
                Object.keys(oldBook.get()).forEach((hash) => {
                    let item = oldBook.get(hash);
                    let entryHash = wsutil.fnvhash(item.address + item.paymentId);
                    if (!addressBookData.hasOwnProperty(entryHash)) {
                        let newAddress = {
                            name: item.name,
                            address: item.address,
                            paymentId: item.paymentId,
                            qrCode: wsutil.genQrDataUrl(item.address)
                        };
                        newBook.data[entryHash] = newAddress;
                    }
                });
                setTimeout(() => {
                    addressBook.save(newBook);
                    fs.rename(oldAddressBook, oldAddressBook + '.deprecated.txt', (err) => {
                        if (err) console.error('Failed to rename old addressbook');
                    });
                }, 500);
                return newBook;
            }
        });
    }

    // address book list
    function renderList(data) {
        if (!window.ABGRID) {
            let columnDefs = [
                { headerName: 'Key', field: 'key', hide: true },
                {
                    headerName: 'Name',
                    field: 'value.name',
                    width: 240,
                    suppressSizeToFit: true,
                    autoHeight: true,
                    checkboxSelection: true,
                    headerCheckboxSelection: true,
                    headerCheckboxSelectionFilteredOnly: true,
                    sortingOrder: ['asc', 'desc']
                },
                { headerName: "Wallet Address", field: "value.address", sortingOrder: ['asc', 'desc'] }
            ];

            let gridOptions = {
                columnDefs: columnDefs,
                rowData: data,
                pagination: false,
                paginationPageSize: 20,
                cacheQuickFilter: true,
                enableSorting: true,
                suppressRowClickSelection: true,
                rowClass: 'ab-item',
                rowSelection: 'multiple',
                onSelectionChanged: function (e) {
                    let rowCount = e.api.getSelectedNodes().length;
                    let rowCountEl = document.querySelector('#abRowCount');

                    if (rowCount <= 0) {
                        rowCountEl.textContent = 'No item selected';//`Total entries: ${data.length}`;
                        rowCountEl.classList.remove('ab-delselected');
                    } else {
                        rowCountEl.textContent = `Delete ${rowCount} selected item(s)`;
                        rowCountEl.classList.add('ab-delselected');
                    }
                },
                onRowClicked: renderItem
            };
            let abGrid = document.getElementById('abGrid');
            window.ABGRID = new AgGrid.Grid(abGrid, gridOptions);
            window.ABOPTSAPI = gridOptions;

            gridOptions.onGridReady = function () {
                abGrid.style.width = "100%";
                let sp = document.createElement('span');
                sp.setAttribute('id', 'abRowCount');
                sp.textContent = 'No item selected';
                let agPanel = document.querySelector('#abGrid .ag-paging-panel');
                agPanel.prepend(sp);

                setTimeout(function () {
                    window.ABOPTSAPI.api.doLayout();
                    window.ABOPTSAPI.api.sizeColumnsToFit();
                }, 100);
            };

            window.addEventListener('resize', () => {
                if (window.ABOPTSAPI) {
                    window.ABOPTSAPI.api.sizeColumnsToFit();
                }
            });

            let abfilter = document.getElementById('ab-search');
            abfilter.addEventListener('input', function () {
                if (window.ABOPTSAPI) {
                    window.ABOPTSAPI.api.setQuickFilter(this.value);
                }
            });
        } else {
            window.ABOPTSAPI.api.setRowData(data);
            window.ABOPTSAPI.api.deselectAll();
            window.ABOPTSAPI.api.resetQuickFilter();
            window.ABOPTSAPI.api.sizeColumnsToFit();
        }
    }

    // display address book item
    function renderItem(e) {
        let data = e.data;
        let dialog = document.getElementById('ab-dialog');
        if (dialog.hasAttribute('open')) dialog.close();

        let tpl = `
        <div class="div-transactions-panel">
                 <h4>Address Detail</h4>
                 <div class="addressBookDetail">
                     <div class="addressBookDetail-qr">
                         <img src="${data.value.qrCode}" />
                     </div>
                     <div class="addressBookDetail-data">
                         <dl>
                             <dt>Name:</dt>
                             <dd data-cplabel="Wallet Name" class="tctcl" title="click to copy">${data.value.name}</dd>
                             <dt>Wallet Address:</dt>
                             <dd data-cplabel="Wallet address" class="tctcl" title="click to copy">${data.value.address}</dd>
                         </dl>
                     </div>
                 </div>
                <div class="div-panel-buttons">
                    <button data-addressid="${data.key}" type="button" class="form-bt button-green ab-edit" id="button-addressbook-panel-edit">Edit</button>
                    <button data-addressid="${data.key}" type="button" class="form-bt button-red ab-delete" id="button-addressbook-panel-delete">Delete</button>
                </div>
                <span title="Close this dialog (esc)" class="dialog-close dialog-close-default" data-target="#ab-dialog"><i class="fas fa-window-close"></i></span>
            </div>`;

        wsutil.innerHTML(dialog, tpl);
        dialog = document.getElementById('ab-dialog');
        dialog.showModal();
    }

    // add new address book file
    addressBookButtonAdd.addEventListener('click', () => {
        let dialog = document.getElementById('ab-dialog');
        if (dialog.hasAttribute('open')) dialog.close();
        let tpl = `
            <div class="div-transactions-panel">
                <h4>Create New Address Book</h4>
                <p class="form-help">Fill this form to create a new, password protected address book</p>
                <div class="input-wrap">
                    <label>Address Book Name:</label>
                    <input id="pAddressbookName" type="text" required="required" class="text-block" placeholder="Required, any label to identify this address book, example: My Contact" />
                </div>
                <div class="input-wrap">
                    <label>Password:</label>
                    <input id="pAddressbookPass" type="password" required="required" class="text-block" placeholder="Required, password to open this address book" />
                    <button data-pf="pAddressbookPass" tabindex="-1" class="togpass notabindex"><i class="fas fa-eye"></i></button>
                </div>
                <div class="input-wrap">
                    <span class="form-ew form-msg text-spaced-error hidden" id="text-paddressbook-error"></span>
                </div>
                <div class="div-panel-buttons">
                    <button id="createNewAddressBook" type="button" class="button-green">Create & activate</button>
                </div>
                <span title="Close this dialog (esc)" class="dialog-close dialog-close-default" data-target="#ab-dialog"><i class="fas fa-window-close"></i></span>
            </div>             
        `;

        wsutil.innerHTML(dialog, tpl);
        dialog = document.getElementById('ab-dialog');
        dialog.showModal();
    });

    wsutil.liveEvent('#button-addressbook-panel-send', 'click', (e) => {
        let origHash = e.target.dataset.addressid;
        let entry = wsession.get('addressBook').data[origHash] || null;
        if (!entry) {
            wsutil.showToast('Invalid address book entry');
        }
        changeSection('section-create-transaction');
        createTransactionRecipientAddress.value = entry.address;
        if (entry.paymentId.length) {
            sendInputPaymentId.value = entry.paymentId;
        }
        // close dialog
        let axdialog = document.getElementById('ab-dialog');
        axdialog.close();
        wsutil.clearChild(axdialog);
    });

    wsutil.liveEvent('#createNewAddressBook', 'click', () => {
        let addrBookNameEl = document.getElementById('pAddressbookName');
        let addrBookPassEl = document.getElementById('pAddressbookPass');
        let name = addrBookNameEl.value.trim() || null;
        let pass = addrBookPassEl.value.trim() || null;
        if (!name || !pass) {
            formMessageReset();
            formMessageSet('paddressbook', 'error', "Address book name & password can not be left blank!");
            return;
        }

        let addrFilename = `ab-${wsutil.fnvhash(name + pass)}.json`;
        let addrPath = path.join(ADDRESS_BOOK_DIR, addrFilename);
        if (wsutil.isFileExist(addrPath)) {
            formMessageReset();
            formMessageSet('paddressbook', 'error', "Same filename exists, please use different filename!");
            return;
        }
        let knownAb = settings.get('address_books', []);
        knownAb.push({
            name: name,
            filename: addrFilename,
        });
        settings.set('address_books', knownAb);

        // finally create & load new adddressbook
        loadAddressBook({ path: addrPath, name: name, pass: pass });
        // close dialog
        let axdialog = document.getElementById('ab-dialog');
        axdialog.close();
        wsutil.clearChild(axdialog);
        // display message
        wsutil.showToast('New address book have been created');
    });

    // switch address book file
    addressBookSelector.addEventListener('change', () => {
        let filename = addressBookSelector.value;
        let name = addressBookSelector.options[addressBookSelector.selectedIndex].text;

        if (filename !== 'default') {
            let dialog = document.getElementById('ab-dialog');
            if (dialog.hasAttribute('open')) dialog.close();
            let tpl = `
                <div class="div-transactions-panel">
                    <h4>Enter password for to open ${name}</h4>
                    <div class="input-wrap">
                        <label>Password:</label>
                        <input id="pAddressbookOpenName" type="hidden" value="${name}" />
                        <input id="pAddressbookOpenFilename" type="hidden" value="${filename}" />
                        <input id="pAddressbookOpenPass" type="password" required="required" class="text-block" placeholder="Required, password to open this address book" />
                        <button data-pf="pAddressbookOpenPass" tabindex="-1" class="togpass notabindex"><i class="fas fa-eye"></i></button>
                    </div>
                    <div class="input-wrap">
                        <span class="form-ew form-msg text-spaced-error hidden" id="text-paddressbookopen-error"></span>
                    </div>
                    <div class="div-panel-buttons">
                        <button id="loadAddressBook" type="button" class="button-green">Open</button>
                    </div>
                    <span id="addressBookSwitcherClose" title="Close this dialog (esc)" class="dialog-close dialog-close-defaultx" data-target="#ab-dialog"><i class="fas fa-window-close"></i></span>
                </div>             
            `;
            wsutil.innerHTML(dialog, tpl);
            dialog = document.getElementById('ab-dialog');
            dialog.showModal();
        } else {
            loadAddressBook({ name: 'default' });
            if (window.addressBookInitialize) {
                wsutil.showToast(`Address book switched to: Default/Built-in`);
            }
        }
    });

    wsutil.liveEvent('#addressBookSwitcherClose', 'click', () => {
        let dialog = document.getElementById('ab-dialog');
        if (dialog.hasAttribute('open')) dialog.close();
        updateAddressBookSelector();
    });

    wsutil.liveEvent('#loadAddressBook', 'click', () => {
        formMessageReset();
        let name = document.getElementById('pAddressbookOpenName').value || null;
        let pass = document.getElementById('pAddressbookOpenPass').value || null;
        let filename = document.getElementById('pAddressbookOpenFilename').value || null;
        let abpath = path.join(ADDRESS_BOOK_DIR, filename);


        if (!pass || !name || !filename) {
            formMessageSet('paddressbookopen', 'error', "Please enter your password!");
            return;
        }
        // try to load
        loadAddressBook({ name: name, pass: pass, path: abpath });
        setTimeout(() => {
            let err = wsession.get('addressBookErr');
            if (false !== err) {
                formMessageSet('paddressbookopen', 'error', err);
                // fallback to builtin
                loadAddressBook({ name: 'default' });
                return;
            } else {
                // close dialog
                let axdialog = document.getElementById('ab-dialog');
                axdialog.close();
                wsutil.clearChild(axdialog);
                // show msg
                if (window.addressBookInitialize) {
                    wsutil.showToast(`Address book switched to: ${name}`);
                }
            }
        }, 100);
    });

    // insert address book entry
    addressBookButtonSave.addEventListener('click', () => {
        formMessageReset();
        let nameValue = addressBookInputName.value ? addressBookInputName.value.trim() : '';
        let addressValue = addressBookInputWallet.value ? addressBookInputWallet.value.trim() : '';
        let isUpdate = addressBookInputUpdate.value ? addressBookInputUpdate.value : 0;

        if (!nameValue || !addressValue) {
            formMessageSet('addressbook', 'error', "Name and wallet address can not be left empty!");
            return;
        }

        if (!wsutil.validateAddress(addressValue)) {
            formMessageSet('addressbook', 'error', `Invalid ${config.assetName} address : must be 'hx' or 'cx' + 40 lowercase characters 0123456789abcdef`);
            return;
        }

        let entryName = nameValue.trim();
        let entryAddr = addressValue.trim();
        let entryHash = wsutil.fnvhash (entryAddr);

        let abook = wsession.get('addressBook');
        let addressBookData = abook.data;
        if (addressBookData.hasOwnProperty(entryHash) && !isUpdate) {
            formMessageSet('addressbook', 'error', "This address already exists, please enter a new address.");
            return;
        }

        let newAddress = {
            name: entryName,
            address: entryAddr,
            qrCode: wsutil.genQrDataUrl(entryAddr)
        };
        abook.data[entryHash] = newAddress;

        // update but address+payid is new
        let oldHash = addressBookInputName.dataset.oldhash || '';
        let isNew = (oldHash.length && oldHash !== entryHash);

        if (isUpdate && isNew) {
            delete abook.data[oldHash];
        }
        wsession.set('addressBook', abook);
        let rowData = Object.entries(abook.data).map(([key, value]) => ({ key, value }));
        window.ABOPTSAPI.api.setRowData(rowData);
        window.ABOPTSAPI.api.deselectAll();
        window.ABOPTSAPI.api.resetQuickFilter();
        window.ABOPTSAPI.api.sizeColumnsToFit();
        wsutil.showToast('Address book entry have been saved.');
        changeSection('section-addressbook');

        // reset
        addressBookInputName.value = '';
        addressBookInputName.dataset.oldhash = '';
        addressBookInputWallet.value = '';
        // addressBookInputPaymentId.value = '';
        addressBookInputUpdate.value = 0;
        formMessageReset();

        setTimeout(() => {
            addressBook.save(abook);
            initAddressCompletion(abook.data);
        }, 500);
    });

    // edit entry
    wsutil.liveEvent('.ab-edit', 'click', function (e) {
        let origHash = e.target.dataset.addressid;
        let entry = wsession.get('addressBook').data[origHash] || null;
        if (!entry) {
            wsutil.showToast('Invalid address book entry');
        } else {
            const nameField = document.getElementById('input-addressbook-name');
            const walletField = document.getElementById('input-addressbook-wallet');
            const payidField = document.getElementById('input-addressbook-paymentid');
            const updateField = document.getElementById('input-addressbook-update');
            nameField.value = entry.name;
            nameField.dataset.oldhash = origHash;
            walletField.value = entry.address;
            payidField.value = entry.paymentId;
            updateField.value = 1;
        }
        changeSection('section-addressbook-add');
        let axdialog = document.getElementById('ab-dialog');
        axdialog.close();
        wsutil.clearChild(axdialog);
    });

    // delete entry
    wsutil.liveEvent('.ab-delete', 'click', function (e) {
        if (!confirm('Are you sure?')) return;

        let et = e.target.dataset.addressid;
        let addressBookData = wsession.get('addressBook');
        if (!addressBookData.data) {
            wsutil.showToast('Invalid address book data');
            return;
        }

        let entry = addressBookData.data[et] || null;
        if (!entry) {
            wsutil.showToast('Invalid address book entry');
            return;
        }

        delete addressBookData.data[et];
        wsession.set('addressBook', addressBookData);
        let rowData = Object.entries(addressBookData.data).map(([key, value]) => ({ key, value }));
        window.ABOPTSAPI.api.setRowData(rowData);
        let axdialog = document.getElementById('ab-dialog');
        axdialog.close();
        wsutil.clearChild(axdialog);
        wsutil.showToast('Address book entry have been deleted');
        setTimeout(() => {
            addressBook.save(addressBookData);
            initAddressCompletion(addressBookData.data);
        }, 500);
    });

    // delete selected
    wsutil.liveEvent('.ab-delselected', 'click', function () {
        if (!confirm('Are you sure?')) return;
        let nodes = window.ABOPTSAPI.api.getSelectedNodes();
        if (nodes.length) {
            let addressBookData = wsession.get('addressBook');
            if (!addressBookData.data) {
                wsutil.showToast('Invalid address book data');
                return;
            }

            nodes.forEach((e) => {
                let entry = addressBookData.data[e.data.key] || null;
                if (entry) {
                    delete addressBookData.data[e.data.key];
                }
            });
            wsession.set('addressBook', addressBookData);
            let rowData = Object.entries(addressBookData.data).map(([key, value]) => ({ key, value }));
            window.ABOPTSAPI.api.setRowData(rowData);
            window.ABOPTSAPI.api.deselectAll();
            wsutil.showToast(`Address book item(s) have been deleted`);
            setTimeout(() => {
                addressBook.save(addressBookData);
                initAddressCompletion(addressBookData.data);
            }, 800);
        }
    });

    function loadAddressBook(params) {
        params = params || false;
        wsession.set('addressBookErr', false);
        if (params) {
            // new address book, reset ab object + session
            wsession.set('addressBook', null);
            if (params.name === 'default') {
                addressBook = new SvalinnAddressbook(ADDRESS_BOOK_DEFAULT_PATH);
            } else {
                addressBook = new SvalinnAddressbook(params.path, params.name, params.pass);
            }
        }

        let currentAddressBook = wsession.get('addressBook');
        let abdata = [];
        if (!currentAddressBook) {
            // new session, load from file
            try {
                addressBook.load()
                    .then((addressData) => {
                        if (!window.addressBookMigrated) {
                            addressData = migrateOldFormat(addressData);
                            window.addressBookMigrated = true;
                        }
                        wsession.set('addressBook', addressData);
                        updateAddressBookSelector(addressData.path);
                        abdata = addressData.data;
                        let ibdata = Object.entries(abdata).map(([key, value]) => ({ key, value }));
                        renderList(ibdata);
                        setTimeout(() => {
                            initAddressCompletion(abdata);
                        }, 800);
                        wsession.set('addressBookErr', false);
                    }).catch((e) => {
                        // todo handle error
                        wsession.set('addressBookErr', e.message);
                    });
            } catch (e) {
                // todo handle error
                wsession.set('addressBookErr', e.message);
            }
        } else {
            // address book already opened
            abdata = currentAddressBook.data;
            let ibdata = Object.entries(abdata).map(([key, value]) => ({ key, value }));
            updateAddressBookSelector(abdata.path);
            renderList(ibdata);
            setTimeout(() => {
                initAddressCompletion(abdata);
            }, 800);
            wsession.set('addressBookErr', false);
        }
    }
    // startup, load default address book
    loadAddressBook();
    // chromium select lag workaround
    setTimeout(() => {
        let event = new MouseEvent('change', {
            view: window,
            bubbles: false,
            cancelable: true
        });
        addressBookSelector.dispatchEvent(event);
        window.addressBookInitialize = true;
    }, 2000);
}

function handleWalletOpen() {
    if (settings.has('recentWallet')) {
        walletOpenInputPath.value = settings.get('recentWallet');
    }

    function setOpenButtonsState(isInProgress) {
        isInProgress = isInProgress ? 1 : 0;
        let extras = document.querySelectorAll('.wallet-open-extra');
        if (isInProgress) {
            walletOpenButtons.classList.add('hidden');
            extras.forEach((x) => { x.classList.add('hidden'); });
        } else {
            walletOpenButtons.classList.remove('hidden');
            extras.forEach((x) => { x.classList.remove('hidden'); });
        }
    }

    function balanceUpdate (address)
    {
        let networkId = overviewNetworkId ? parseInt(overviewNetworkId.value) : 1;

        wsmanager.getBalance (address, networkId).then ((balance) => {
            balance = Number.parseFloat (balance / Math.pow(10, 18));
            wsmanager.notifyUpdate ({
                type: 'balanceUpdated',
                data: balance
            });
        }).catch((err) => {
            wsmanager.notifyUpdate ({
                type: 'balanceUpdated',
                data: "..."
            });
        });
    }

    function startRefreshingWalletBalance ()
    {
        wsmanager.notifyUpdate ({
            type: 'balanceUpdated',
            data: "..."
        });

        overviewWalletAddress.value = wsession.get('loadedWalletAddress');
        balanceUpdate (overviewWalletAddress.value);

        if (refreshWalletWorker) {
            clearInterval (refreshWalletWorker);
        }
        
        refreshWalletWorker = setInterval(() =>{
            balanceUpdate (overviewWalletAddress.value);
        }, WALLET_REFRESH_INTERVAL);
    }

    overviewNetworkId.addEventListener ('change', () => {
        wsmanager.notifyUpdate ({
            type: 'balanceUpdated',
            data: "..."
        });
    });

    walletOpenButtonOpen.addEventListener('click', () =>
    {
        formMessageReset();

        // Open the wallet
        if (!walletOpenInputPath.value) {
            formMessageSet('load', 'error', "Invalid wallet file path");
            WALLET_OPEN_IN_PROGRESS = false;
            setOpenButtonsState(0);
            return;
        }

        function onError(err) {
            formMessageReset();
            formMessageSet('load', 'error', err);
            WALLET_OPEN_IN_PROGRESS = false;
            setOpenButtonsState(0);
            return false;
        }

        function onSuccess() {
            walletOpenInputPath.value = settings.get('recentWallet');
            startRefreshingWalletBalance();

            WALLET_OPEN_IN_PROGRESS = false;
            changeSection('section-overview');

            setTimeout(() => {
                setOpenButtonsState(0);
            }, 300);
        }

        function onDelay(msg) {
            formMessageSet('load', 'warning', `${msg}<br><progress></progress>`);
        }

        let walletFile = walletOpenInputPath.value;

        fs.access (walletFile, fs.constants.R_OK, (err) => {
            if (err) {
                formMessageSet('load', 'error', "Invalid wallet file path");
                setOpenButtonsState(0);
                WALLET_OPEN_IN_PROGRESS = false;
                return false;
            }

            setOpenButtonsState(1);
            WALLET_OPEN_IN_PROGRESS = true;
            settings.set('recentWallet', walletFile);
            settings.set('recentWalletDir', path.dirname(walletFile));
            wsmanager.startService (walletFile, onError, onSuccess, onDelay);
        });
    });

    wsutil.liveEvent('.fake-options', 'click', (e) => {
        let sel = e.target.classList.contains('fake-options') ? e.target : e.target.closest('.fake-options');
        let val = sel.dataset.value;
        walletOpenNodeLabel.innerHTML = sel.innerHTML;
        createTransactionNodeNetwork.value = val;
        var event = new Event('change');
        createTransactionNodeNetwork.dispatchEvent(event);
    });

    let mox = document.getElementById('section-overview-load');
    mox.addEventListener('click', function (e) {
        function isChild(obj, parentObj) {
            while (obj !== undefined && obj !== null && obj.tagName.toUpperCase() !== 'BODY') {
                if (obj === parentObj) {
                    return true;
                }
                obj = obj.parentNode;
            }
            return false;
        }
        let eid = e.target.getAttribute('id');
        if (eid === 'fake-selected-node' || eid === 'fake-select') return;
        if (isChild(e.target, walletOpenSelectBox)) return;
        // walletOpenSelectOpts.classList.add('hidden');
    });
}

function handleWalletClose() {
    overviewWalletCloseButton.addEventListener('click', (event) => {
        event.preventDefault();
        // if (!confirm('Are you sure you want to close your wallet?')) return;

        let dialog = document.getElementById('main-dialog');
        let htmlStr = '<div class="div-save-main" style="text-align: center;padding:1rem;"><i class="fas fa-spinner fa-pulse"></i><span style="padding:0px 10px;">Saving &amp; closing your wallet...</span></div>';
        wsutil.innerHTML(dialog, htmlStr);

        dialog = document.getElementById('main-dialog');
        dialog.showModal();
        // save + SIGTERMed wallet daemon
        // clear form err msg
        formMessageReset();
        changeSection('section-overview');
        dialog = document.getElementById('main-dialog');
        if (dialog.hasAttribute('open')) dialog.close();
        wsmanager.resetState();
        wsutil.clearChild(dialog);

        clearInterval(refreshWalletWorker);

        // Go to welcome page
        changeSection("section-welcome");
    });
}

function handleWalletCreate() {
    createWalletButtonCreate.addEventListener('click', () => {
        formMessageReset();
        let filePathValue = createWalletPath.value ? createWalletPath.value.trim() : '';
        let passwordValue = createWalletPassword.value ? createWalletPassword.value.trim() : '';

        // validate path
        wsutil.validateWalletPath(filePathValue, DEFAULT_WALLET_PATH).then((finalPath) => {
            // validate password
            if (!passwordValue.length) {
                formMessageSet('create', 'error', `Please enter a password, creating wallet without a password will not be supported!`);
                return;
            }

            settings.set('recentWalletDir', path.dirname(finalPath));

            // user already confirm to overwrite
            if (wsutil.isRegularFileAndWritable(finalPath)) {
                try {
                    // for now, backup instead of delete
                    let ts = new Date().getTime();
                    let backfn = `${finalPath}.bak.${ts}`;
                    fs.renameSync(finalPath, backfn);
                    //fs.unlinkSync(finalPath);
                } catch (err) {
                    formMessageSet('create', 'error', `Unable to overwrite existing file, please enter new wallet file path`);
                    return;
                }
            }

            // create
            wsmanager.createWallet(
                finalPath,
                passwordValue
            ).then((walletFile) => {
                settings.set('recentWallet', walletFile);
                walletOpenInputPath.value = walletFile;
                changeSection('section-overview-load');
                wsutil.showToast('Wallet have been created, you can now open your wallet!', 12000);
            }).catch((err) => {
                formMessageSet('create', 'error', err.message);
                return;
            });
        }).catch((err) => {
            formMessageSet('create', 'error', err.message);
            return;
        });
    });
}

function handleWalletImportKeys() {
    importKeyButtonImport.addEventListener('click', () => {
        formMessageReset();
        let filePathValue = importKeyInputPath.value ? importKeyInputPath.value.trim() : '';
        let passwordValue = importKeyInputPassword.value ? importKeyInputPassword.value.trim() : '';
        let viewKeyValue = importKeyInputViewKey.value ? importKeyInputViewKey.value.trim() : '';

        // validate path
        wsutil.validateWalletPath(filePathValue, DEFAULT_WALLET_PATH).then((finalPath) => {
            if (!passwordValue.length) {
                formMessageSet('import', 'error', `Please enter a password, creating wallet without a password will not be supported!`);
                return;
            }

            if (!wsutil.validateSecretKey(viewKeyValue)) {
                formMessageSet('import', 'error', 'Invalid private key!');
                return;
            }

            settings.set('recentWalletDir', path.dirname(finalPath));

            // user already confirm to overwrite
            if (wsutil.isRegularFileAndWritable(finalPath)) {
                try {
                    // for now, backup instead of delete, just to be safe
                    let ts = new Date().getTime();
                    let backfn = `${finalPath}.bak${ts}`;
                    fs.renameSync(finalPath, backfn);
                    //fs.unlinkSync(finalPath);
                } catch (err) {
                    formMessageSet('import', 'error', `Unable to overwrite existing file, please enter new wallet file path`);
                    return;
                }
            }
            wsmanager.importFromKeys(
                finalPath,// walletfile
                passwordValue,
                viewKeyValue
            ).then((walletFile) => {
                settings.set('recentWallet', walletFile);
                walletOpenInputPath.value = walletFile;
                changeSection('section-overview-load');
                wsutil.showToast('Wallet have been imported, you can now open your wallet!', 12000);
            }).catch((err) => {
                formMessageSet('import', 'error', err);
                return;
            });

        }).catch((err) => {
            formMessageSet('import', 'error', err.message);
            return;
        });
    });
}

function handleWalletExport()
{
    showkeyButtonRevealKey.addEventListener('click', () =>
    {
        formMessageReset();
        let walletPass = overviewShowPassword.value;

        if (!walletPass) {
            formMessageSet ('secret', 'error', "You need to input the wallet password before clicking on Reveal");
            return;
        }

        wsmanager.getSecretKeys (walletPass).then ((privateKey) => {
            showkeyInputViewKey.value = privateKey;
        }).catch((err) => {
            formMessageSet ('secret', 'error', "Failed to decrypt the private key : " + err);
        });
    });

    showkeyButtonExportKey.addEventListener('click', () =>
    {
        formMessageReset();
        let filename = remote.dialog.showSaveDialog({
            title: "Export keys to file...",
            filters: [
                { name: 'Text files', extensions: ['txt'] }
            ]
        });
        if (filename) {
            let walletPass = overviewShowPassword.value;
            wsmanager.getSecretKeys(walletPass).then((privateKey) => {
                let textContent = `Wallet Address:${os.EOL}${wsession.get('loadedWalletAddress')}${os.EOL}`;
                textContent += `${os.EOL}Private Key:${os.EOL}${privateKey}${os.EOL}`;
                try {
                    fs.writeFileSync(filename, textContent);
                    formMessageSet('secret', 'success', 'Your keys have been exported, please keep the file secret!');
                } catch (err) {
                    formMessageSet('secret', 'error', "Failed to save your keys, please check that you have write permission to the file");
                }
            }).catch(() => {
                formMessageSet('secret', 'error', "Failed to get keys, please try again in a few seconds");
            });
        }
    });
}

function handleCreateTransaction()
{
    createTransactionStepLimit.value = 100000;

    createTransactionRecipientAddress.addEventListener('change', (event) => {
        let addr = event.target.value || '';
        let abdata = wsession.get('addressBook').data || null;
        if (!addr.length) initAddressCompletion(abdata);
    });

    createTransactionRecipientAddress.addEventListener('keyup', (event) => {
        let addr = event.target.value || '';
        let abdata = wsession.get('addressBook').data || null;
        if (!addr.length) initAddressCompletion(abdata);
    });

    createTransactionButtonCreate.addEventListener('click', () =>
    {
        formMessageReset();

        function precision(a) {
            if (!isFinite(a)) return 0;
            let e = 1, p = 0;
            while (Math.round(a * e) / e !== a) { e *= 10; p++; }
            return p;
        }

        let recipientAddress = createTransactionRecipientAddress.value ? createTransactionRecipientAddress.value.trim() : '';
        if (!recipientAddress.length || !wsutil.validateAddress(recipientAddress)) {
            formMessageSet('create-transaction', 'error', `Invalid ${config.assetName} address : must be 'hx' or 'cx' + 40 lowercase characters 0123456789abcdef`);
            return;
        }

        if (recipientAddress === wsession.get('loadedWalletAddress')) {
            formMessageSet('create-transaction', 'error', "Sorry, can't send to your own address");
            return;
        }

        const passwordValue = createTransactionWalletPassword.value ? createTransactionWalletPassword.value.trim() : '';
        if (passwordValue == '') {
            formMessageSet('create-transaction', 'error', `Wallet password must be filled`);
            return;
        }

        let txFilePath = createTransactionTxFile.value ? createTransactionTxFile.value.trim() : '';
        if (txFilePath == '') {
            formMessageSet('create-transaction', 'error', `You need to submit the transaction file path.`);
            return;
        }

        // Check network ID
        let networkId = createTransactionNodeNetwork.value ? createTransactionNodeNetwork.value.trim() : '';
        if (networkId == '') {
            formMessageSet('create-transaction', 'error', `You need to submit a network.`);
            return;
        }

        networkId = parseInt(networkId);
        if (networkId > wsmanager.iconNetworks.length) {
            formMessageSet('create-transaction', 'error', `Invalid network.`);
            return;
        }

        let network = wsmanager.iconNetworks[networkId];

        // Check amount
        let amount = createTransactionIcxAmount.value ? parseFloat(createTransactionIcxAmount.value) : 0;
        if (amount < 0) {
            formMessageSet('create-transaction', 'error', 'Sorry, invalid amount (must be positive)');
            return;
        }
        if (precision(amount) > config.decimalPlaces) {
            formMessageSet('create-transaction', 'error', `Amount can't have more than ${config.decimalPlaces} decimal places`);
            return;
        }

        // Check fee
        let fee = createTransactionStepLimit.value ? parseFloat(createTransactionStepLimit.value) : 0;
        let minFee = config.minimumFee;
        if (fee < minFee) {
            formMessageSet('create-transaction', 'error', `Fee can't be less than ${config.minimumFee}`);
            return;
        }
        if (precision(fee) > config.decimalPlaces) {
            formMessageSet('create-transaction', 'error', `Fee can't have more than ${config.decimalPlaces} decimal places`);
            return;
        }

        // Get current timestamp
        var timeStampInMs = 
            window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? 
                window.performance.now() + window.performance.timing.navigationStart 
              : Date.now();

        let tx = {
            to: recipientAddress,
            from: wsession.get('loadedWalletAddress'),
            value: Math.trunc (Math.pow (10, 18) * amount), // 1 ICX = 10**18 Loops
            stepLimit: fee,
            nid: network.nid,
            nonce: 0,
            version: "0x3",
            timestamp: timeStampInMs * 1000
        };

        // if (paymentId.length) tx.paymentId = paymentId;

        let tpl = `
            <div class="div-transaction-panel">
                <h4>Transfer Confirmation</h4>
                <div class="transferDetail">
                    <p>Please confirm that you have everything entered correctly.</p>
                    <dl>
                        <dt class="dt-ib">Source address:</dt>
                        <dd class="dd-ib">${tx.from}</dd>
                        <dt class="dt-ib">Destination address:</dt>
                        <dd class="dd-ib">${tx.to}</dd>
                        <dt class="dt-ib">Amount:</dt>
                        <dd class="dd-ib">${tx.value / Math.pow (10, 18)} ${config.assetTicker}</dd>
                        <dt class="dt-ib">Step Limit</dt>
                        <dd class="dd-ib">${tx.stepLimit} steps</dd>
                        <dt class="dt-ib">Network</dt>
                        <dd class="dd-ib">${wsmanager.iconNetworks[tx.nid].desc} (${wsmanager.iconNetworks[tx.nid].url})</dd>
                        <dt class="dt-ib">Timestamp</dt>
                        <dd class="dd-ib">${new Date(tx.timestamp / 1000)}</dd>
                    </dl>
                </div>
                <div class="div-panel-buttons">
                    <button data-target='#tf-dialog' type="button" class="form-bt button-red dialog-close-default" id="button-create-tx-ko">Cancel</button>
                    <button data-target='#tf-dialog' type="button" class="form-bt button-green" id="button-create-tx-ok">OK, Create the transaction</button>
                </div>
                <span title="Close this dialog (esc)" class="dialog-close dialog-close-default" data-target="#ab-dialog"><i class="fas fa-window-close"></i></span>
            </div>`;

        let dialog = document.getElementById('tf-dialog');
        wsutil.innerHTML(dialog, tpl);
        dialog = document.getElementById('tf-dialog');
        dialog.showModal();

        let createTxOkBtn = dialog.querySelector('#button-create-tx-ok');

        createTxOkBtn.addEventListener('click', (event) =>
        {
            let md = document.querySelector(event.target.dataset.target);
            md.close();
            
            // validate path
            wsutil.validateTransactionPath (txFilePath, DEFAULT_TRANSACTION_PATH).then ((finalPath) => {
                // user already confirm to overwrite
                if (wsutil.isRegularFileAndWritable(finalPath)) {
                    try {
                        // delete the old tx file
                        fs.unlinkSync(finalPath);
                    } catch (err) {
                        formMessageSet ('create', 'error', `Unable to overwrite existing file, please enter new transaction file path`);
                        return;
                    }
                }

                // create transaction
                wsmanager.createTransaction (tx, finalPath, settings.get('recentWallet'), passwordValue).then((transactionFile) => {
                    formMessageSet('create-transaction', 'success', 'Transaction has been created, you can now send it using the "Send transaction" menu !');
                }).catch((err) => {
                    formMessageSet('create-transaction', 'error', `Transaction can not be created, please check your input and try again : ${err}`);
                    return;
                });
                
            }).catch((err) => {
                formMessageSet('create-transaction', 'error', `Invalid transaction file path, please enter another one.`);
                return;
            });

            wsutil.clearChild(md);
        });
    });

    sendTransactionButtonSend.addEventListener('click', () =>
    {
        formMessageReset();
        let tx;

        let txPath = sendTransactionTxFile.value ? sendTransactionTxFile.value.trim() : '';
        if (txPath == '') {
            formMessageSet('send-transaction', 'error', `You need to chose a transaction that contains your transaction to send.`);
            return;
        }

        try {
            tx = JSON.parse (fs.readFileSync (txPath, 'utf8'));
        } catch (err) {
            formMessageSet('send-transaction', 'error', `Cannot read the transaction file.`);
            return;
        }

        // Hack : simulate a SignedTransaction object, as the SDK doesn't provide a way
        // to create a SignedTransaction object without the private key
        tx.getProperties = function () {
            return this;
        }

        let nid = parseInt(tx.nid, 16);
        let txValue = tx.value ? parseInt(tx.value, 16) / Math.pow (10, 18) : 0;

        let tpl = `
            <div class="div-transaction-panel">
                <h4>Transfer Confirmation</h4>
                <div class="transferDetail">
                    <p>Please confirm that the transaction is correct.</p>
                    <dl>
                        <dt class="dt-ib">Source address:</dt>
                        <dd class="dd-ib">${tx.from}</dd>
                        <dt class="dt-ib">Destination address:</dt>
                        <dd class="dd-ib">${tx.to}</dd>
                        <dt class="dt-ib">Amount:</dt>
                        <dd class="dd-ib">${txValue} ${config.assetTicker}</dd>
                        <dt class="dt-ib">Step Limit</dt>
                        <dd class="dd-ib">${parseInt(tx.stepLimit, 16)} steps</dd>
                        <dt class="dt-ib">Network</dt>
                        <dd class="dd-ib">${wsmanager.iconNetworks[nid].desc} (${wsmanager.iconNetworks[nid].url})</dd>
                        <dt class="dt-ib">Timestamp</dt>
                        <dd class="dd-ib">${new Date(tx.timestamp / 1000)}</dd>
                    </dl>
                </div>
                <div class="div-panel-buttons">
                    <button data-target='#tf-dialog' type="button" class="form-bt button-red dialog-close-default" id="button-send-tx-ko">Cancel</button>
                    <button data-target='#tf-dialog' type="button" class="form-bt button-green" id="button-send-tx-ok">OK, Send the transaction</button>
                </div>
                <span title="Close this dialog (esc)" class="dialog-close dialog-close-default" data-target="#ab-dialog"><i class="fas fa-window-close"></i></span>
            </div>`;

        let dialog = document.getElementById('tf-dialog');
        wsutil.innerHTML(dialog, tpl);
        dialog = document.getElementById('tf-dialog');
        dialog.showModal();

        let sendTxOkBtn = dialog.querySelector('#button-send-tx-ok');

        sendTxOkBtn.addEventListener('click', (event) =>
        {
            formMessageSet('send-transaction', 'warning', `Sending transaction...<br><progress></progress>`);

            let md = document.querySelector(event.target.dataset.target);
            md.close();
 
            wsmanager.sendSignedTransaction (tx).then ((txHash) => {
                let url = wsmanager.iconNetworks[nid].tracker + "/transaction/" + txHash;
                sendTransactionTxHash.innerHTML = '<a href="#" id="go-tracker-transaction" class="dont-color-link">' + txHash + '</a>';
                let goTrackerTx = sendTransactionTxHash.querySelector ('#go-tracker-transaction');
                goTrackerTx.addEventListener('click', (event) => {
                    shell.openExternal (url);
                });

                sendTransactionHiddenTxHash.style.display = "block";
                formMessageSet('send-transaction', 'success', `Transaction sent successfully !`);
            }).catch((err) => {
                formMessageSet('send-transaction', 'error', `Cannot send the transaction : ${err}`);
            });

            wsutil.clearChild(md);
        });
    });
}

// event handlers
function initHandlers()
{
    initSectionTemplates();
    setDarkMode(settings.get('darkmode', true));

    // main section link handler
    for (var ei = 0; ei < sectionButtons.length; ei++) {
        let target = sectionButtons[ei].dataset.section;
        sectionButtons[ei].addEventListener('click', changeSection.bind(this, target), false);
    }
    // misc shortcut
    dmswitch.addEventListener('click', () => {
        let tmode = thtml.classList.contains('dark') ? '' : 'dark';
        setDarkMode(tmode);
    });
    kswitch.addEventListener('click', showKeyBindings);
    iswitch.addEventListener('click', showAbout);
    //added by FidelVe delete from here
    _LANG_.addEventListener('click', showLangSelection);
    //delete to here

    function handleBrowseButton(args) {
        if (!args) return;
        let tbtn = document.getElementById(args.targetButton);
        if (tbtn.classList.contains('d-opened')) return;
        tbtn.classList.add('d-opened');
        let dialogType = args.dialogType;
        let extension = args.dialogExtension;
        let objectName = args.dialogObject;
        let targetName = (args.targetName ? args.targetName : 'file');
        let targetInput = args.targetInput;
        let recentDir = settings.get('recentWalletDir', remote.app.getPath('documents'));
        let dialogOpts = {
            defaultPath: recentDir
        };

        if (dialogType === 'saveFile') {
            dialogOpts.title = `Select directory to store your ${targetName}, and give it a filename.`;
            dialogOpts.buttonLabel = 'OK';
            dialogOpts.filters = [
                { name : objectName, extensions : [extension]},
                { name : 'All Files', extensions : ['*']}
            ];

            remote.dialog.showSaveDialog(dialogOpts, (file) => {
                if (file) targetInput.value = file;
                tbtn.classList.remove('d-opened');
            });
        } else {
            dialogOpts.properties = [dialogType];
            dialogOpts.filters = [
                { name : objectName, extensions : [extension]},
                { name : 'All Files', extensions : ['*']}
            ];
            
            remote.dialog.showOpenDialog(dialogOpts, (files) => {
                if (files) targetInput.value = files[0];
                tbtn.classList.remove('d-opened');
            });
        }
    }

    function handleFormEnter(el) {
        try { clearTimeout(window.enterHandler); } catch (_e) { }
        let key = this.event.key;
        window.enterHandler = setTimeout(() => {
            if (key === 'Enter') {
                let section = el.closest('.section');
                let target = section.querySelector('button:not(.notabindex)');
                if (target) {
                    let event = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    target.dispatchEvent(event);
                }
            }
        }, 400);
    }

    // open wallet
    handleWalletOpen();
    // create wallet
    handleWalletCreate();
    // import keys
    handleWalletImportKeys();
    // delay some handlers
    setTimeout(() => {
        // addressbook handlers
        handleAddressBook();
        // close wallet
        handleWalletClose();
        // export keys/seed
        handleWalletExport();
        // Create Transaction
        handleCreateTransaction();
        // Check update
        checkUpdate();
        //external link handler
        wsutil.liveEvent('a.external', 'click', (event) => {
            event.preventDefault();
            shell.openExternal(event.target.getAttribute('href'));
            return false;
        });
        // toggle password visibility
        wsutil.liveEvent('.togpass', 'click', (e) => {
            let tg = e.target.classList.contains('.togpas') ? e.target : e.target.closest('.togpass');
            if (!tg) return;
            let targetId = tg.dataset.pf || null;
            if (!targetId) return;
            let target = document.getElementById(targetId);
            target.type = (target.type === "password" ? 'text' : 'password');
            tg.firstChild.dataset.icon = (target.type === 'password' ? 'eye-slash' : 'eye');
        });
        // context menu
        const pasteMenu = Menu.buildFromTemplate([{ label: 'Paste', role: 'paste' }]);
        for (var ui = 0; ui < genericEditableInputs.length; ui++) {
            let el = genericEditableInputs[ui];
            el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                pasteMenu.popup(remote.getCurrentWindow());
            }, false);
        }
        // generic browse path btn event
        for (var i = 0; i < genericBrowseButton.length; i++) {
            let targetInputId = genericBrowseButton[i].dataset.targetinput;
            let args = {
                dialogType: genericBrowseButton[i].dataset.selection,
                dialogExtension: genericBrowseButton[i].dataset.extension,
                dialogObject: genericBrowseButton[i].dataset.object,
                targetName: genericBrowseButton[i].dataset.fileobj ? genericBrowseButton[i].dataset.fileobj : '',
                targetInput: document.getElementById(targetInputId),
                targetButton: genericBrowseButton[i].id
            };
            genericBrowseButton[i].addEventListener('click', handleBrowseButton.bind(this, args));
        }
        // generic dialog closer
        wsutil.liveEvent('.dialog-close-default', 'click', () => {
            let d = document.querySelector('dialog[open]');
            if (d) d.close();
        });
        // form submit
        for (var oi = 0; oi < genericEnterableInputs.length; oi++) {
            let el = genericEnterableInputs[oi];
            el.addEventListener('keyup', handleFormEnter.bind(this, el));
        }
        wsutil.liveEvent('dialog input:not(.noenter)', 'keyup', (e) => {
            let key = this.event.key;
            try { clearTimeout(window.enterHandler); } catch (_e) { }
            window.enterHandler = setTimeout(() => {
                if (key === 'Enter') {
                    let section = e.target.closest('dialog');
                    let target = section.querySelector('button:not(.notabindex)');
                    if (target) {
                        let event = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        target.dispatchEvent(event);
                    }
                }
            });
        });
       
        // inputs click to copy handlers
        wsutil.liveEvent('textarea.ctcl, input.ctcl', 'click', (event) => {
            let el = event.target;
            let wv = el.value ? el.value.trim() : '';
            if (!wv.length) return;
            clipboard.writeText(wv);

            let cplabel = el.dataset.cplabel ? el.dataset.cplabel : '';
            let cpnotice = cplabel ? `${cplabel} copied to clipboard!` : 'Copied to clipboard';
            wsutil.showToast(cpnotice);
        });
        // non-input elements ctc handlers
        wsutil.liveEvent('.tctcl', 'click', (event) => {
            let el = event.target;
            let wv = el.textContent.trim();
            if (!wv.length) return;
            clipboard.writeText(wv);
            let cplabel = el.dataset.cplabel ? el.dataset.cplabel : '';
            let cpnotice = cplabel ? `${cplabel} copied to clipboard!` : 'Copied to clipboard';
            wsutil.showToast(cpnotice);
        });
        initKeyBindings();
    }, 1200);
}

function initKeyBindings() {
    let walletOpened;
    // switch tab: ctrl+tab
    Mousetrap.bind(['ctrl+tab', 'command+tab', 'ctrl+pagedown'], switchTab);
    Mousetrap.bind(['ctrl+o', 'command+o'], () => {
        walletOpened = wsession.get('serviceReady') || false;
        if (walletOpened) {
            wsutil.showToast('Please close current wallet before opening another wallet!');
            return;
        }
        return changeSection('section-overview-load');
    });
    Mousetrap.bind(['ctrl+x', 'command+x'], () => {
        walletOpened = wsession.get('serviceReady') || false;
        if (!walletOpened) {
            wsutil.showToast('No wallet is currently opened');
            return;
        }
        overviewWalletCloseButton.dispatchEvent(new Event('click'));
    });
    // display/export private keys: ctrl+e
    Mousetrap.bind(['ctrl+e', 'command+e'], () => {
        walletOpened = wsession.get('serviceReady') || false;
        if (!walletOpened) return;
        return changeSection('section-overview-show');
    });
    // create new wallet: ctrl+n
    Mousetrap.bind(['ctrl+n', 'command+n'], () => {
        walletOpened = wsession.get('serviceReady') || false;
        if (walletOpened) {
            wsutil.showToast('Please close current wallet before creating/importing new wallet');
            return;
        }
        return changeSection('section-overview-create');
    });
    // import from keys: ctrl+i
    Mousetrap.bind(['ctrl+i', 'command+i'], () => {
        walletOpened = wsession.get('serviceReady') || false;
        if (walletOpened) {
            wsutil.showToast('Please close current wallet before creating/importing new wallet');
            return;
        }
        return changeSection('section-overview-import-key');
    });
    // tx page: ctrl+t
    Mousetrap.bind(['ctrl+t', 'command+t'], () => {
        walletOpened = wsession.get('serviceReady') || false;
        if (!walletOpened) {
            wsutil.showToast('Please open your wallet to view your transactions');
            return;
        }
        return changeSection('section-send-transaction');
    });
    // send tx: ctrl+s
    Mousetrap.bind(['ctrl+s', 'command+s'], () => {
        walletOpened = wsession.get('serviceReady') || false;
        if (!walletOpened) {
            wsutil.showToast('Please open your wallet to make a transfer');
            return;
        }
        return changeSection('section-create-transaction');
    });
    // import from mnemonic seed: ctrl+shift+i
    Mousetrap.bind(['ctrl+shift+i', 'command+shift+i'], () => {
        walletOpened = wsession.get('serviceReady') || false;
        if (walletOpened) {
            wsutil.showToast('Please close current wallet before creating/importing new wallet');
            return;
        }
        return changeSection('section-overview-import-seed');
    });

    // back home
    Mousetrap.bind(['ctrl+home', 'command+home'], () => {
        walletOpened = wsession.get('serviceReady') || false;
        let section = walletOpened ? 'section-overview' : 'section-welcome';
        return changeSection(section);
    });

    // show key binding
    Mousetrap.bind(['ctrl+/', 'command+/'], () => {
        let openedDialog = document.querySelector('dialog[open]');
        if (openedDialog) return openedDialog.close();
        return showKeyBindings();
    });

    Mousetrap.bind('esc', () => {
        let openedDialog = document.querySelector('dialog[open]');
        if (!openedDialog) return;
        return openedDialog.close();
    });

    Mousetrap.bind([`ctrl+d`, `command+d`], () => {
        setDarkMode(!document.documentElement.classList.contains('dark'));
    });
}

// spawn event handlers
document.addEventListener('DOMContentLoaded', () => {
    initHandlers();
    showInitialPage();
}, false);

ipcRenderer.on('cleanup', () => {
    if (!win.isVisible()) win.show();
    if (win.isMinimized()) win.restore();

    win.focus();

    var dialog = document.getElementById('main-dialog');
    let htmlText = 'Terminating Svalinn...';
    if (wsession.get('loadedWalletAddress') !== '') {
        htmlText = 'Saving &amp; closing your wallet...';
    }

    let htmlStr = `<div class="div-save-main" style="text-align: center;padding:1rem;"><i class="fas fa-spinner fa-pulse"></i><span style="padding:0px 10px;">${htmlText}</span></div>`;
    dialog.innerHTML = htmlStr;
    dialog.showModal();
    try { fs.unlinkSync(wsession.get('walletConfig')); } catch (e) { }
    win.close();
});
