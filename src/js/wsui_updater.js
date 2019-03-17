const { remote } = require('electron');
const Store = require('electron-store');
const wsutil = require('./ws_utils');
const SvalinnSession = require('./ws_session');
const settings = new Store({ name: 'Settings' });
const sessConfig = { debug: remote.app.debug, walletConfig: remote.app.walletConfig };
const wsession = new SvalinnSession(sessConfig);

function updateBalance (availableBalance)
{
    const balanceAvailableField = document.querySelector('#balance-available > span');
    balanceAvailableField.innerHTML = availableBalance;
    wsession.set ('walletUnlockedBalance', availableBalance);
}

function resetFormState() {
    const allFormInputs = document.querySelectorAll('.section input,.section textarea');
    if (!allFormInputs) return;

    for (var i = 0; i < allFormInputs.length; i++) {
        let el = allFormInputs[i];
        if (el.dataset.initial) {
            if (!el.dataset.noclear) {
                el.value = settings.has(el.dataset.initial) ? settings.get(el.dataset.initial) : '';
                if (el.getAttribute('type') === 'checkbox') {
                    el.checked = settings.get(el.dataset.initial);
                }
            }
        } else if (el.dataset.default) {
            if (!el.dataset.noclear) {
                el.value = el.dataset.default;
            }
        } else {
            if (!el.dataset.noclear) el.value = '';
            if (el.dataset.hidden) {
                el.parentNode.style.display = "none";
            }
        }
    }
    
    const hidemeElements = document.querySelectorAll('div.hideme');
    for (var i = 0; i < hidemeElements.length; i++) {
        let el = hidemeElements[i];
        el.style.display = "none";
    }
}

// update ui state, push from svc_main
function updateUiState(msg) {
    // do something with msg
    switch (msg.type) {
        case 'balanceUpdated':
            updateBalance(msg.data);
            break;
        case 'sectionChanged':
            if (msg.data) resetFormState(msg.data);
            break;
        default:
            console.log('invalid command', msg);
            break;
    }
}

module.exports = { updateUiState };
