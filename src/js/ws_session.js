const SESSION_KEY = 'svalinSessionKey';

var SvalinnSession = function (opts) {
    if (!(this instanceof SvalinnSession)) return new SvalinnSession(opts);
    opts = opts || {};

    this.sessKey = SESSION_KEY;
    this.eventName = 'sessionUpdated';
    this.sessDefault = {
        loadedWalletAddress: '',
        walletUnlockedBalance: 0,
        walletConfig: opts.walletConfig || 'wconfig.txt',
        serviceReady: false,
        debug: opts.debug || false,
        addressBookErr: false
    };

    this.stickyVals = {
        addressBook: null
    };

    this.keys = Object.keys({ ...this.sessDefault, ...this.stickyVals });
    // initialize
    if (!sessionStorage.getItem(this.sessKey)) {
        sessionStorage.setItem(this.sessKey, JSON.stringify({ ...this.sessDefault, ...this.stickyVals }));
    }
};

SvalinnSession.prototype.get = function (key) {
    key = key || false;
    if (!key) {
        return JSON.parse(sessionStorage.getItem(this.sessKey)) || this.sessDefault;
    }

    if (!this.keys.includes(key)) {
        throw new Error(`Invalid session key: ${key}`);
    }

    return JSON.parse(sessionStorage.getItem(this.sessKey))[key];
};

SvalinnSession.prototype.getDefault = function (key) {
    if (!key) {
        return this.sessDefault;
    }
    return this.sessDefault[key];
};

SvalinnSession.prototype.set = function (key, val) {
    if (!this.keys.includes(key)) {
        throw new Error(`Invalid session key: ${key}`);
    }

    let sessData = this.get(); // all current data obj
    sessData[key] = val; // update value
    return sessionStorage.setItem(this.sessKey, JSON.stringify(sessData));
};

SvalinnSession.prototype.reset = function (key) {
    if (key) {
        if (!this.sessDefault.hasOwnProperty(key)) {
            throw new Error('Invalid session key');
        }

        let sessData = this.get(); // all current data obj
        sessData[key] = this.sessDefault[key]; // set to default value
        return sessionStorage.setItem(this.sessKey, JSON.stringify(sessData[key]));
    }

    let stickyData = {};
    Object.keys(this.stickyVals).forEach((e) => {
        stickyData[e] = this.get(e);
    });

    return sessionStorage.setItem(this.sessKey, JSON.stringify({ ...this.sessDefault, ...stickyData }));
};

SvalinnSession.prototype.destroy = function () {
    return sessionStorage.removeItem(this.sessKey);
};

module.exports = SvalinnSession;