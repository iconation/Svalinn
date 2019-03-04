const path = require('path');
const fs = require('fs');
const os = require('os');
const childProcess = require('child_process');
const log = require('electron-log');
const Store = require('electron-store');
const SvalinnSession = require('./ws_session');
const SvalinnApi = require('./ws_api');
const uiupdater = require('./wsui_updater');
const wsutil = require('./ws_utils');
const config = require('./ws_config');
const IconService = require('icon-sdk-js');
const { remote } = require('electron');
const settings = new Store({ name: 'Settings' });
const sessConfig = { debug: remote.app.debug, walletConfig: remote.app.walletConfig };
const wsession = new SvalinnSession(sessConfig);

const SERVICE_LOG_DEBUG = wsession.get('debug');
const SERVICE_LOG_LEVEL_DEFAULT = 0;
const SERVICE_LOG_LEVEL_DEBUG = 5;
const SERVICE_LOG_LEVEL = (SERVICE_LOG_DEBUG ? SERVICE_LOG_LEVEL_DEBUG : SERVICE_LOG_LEVEL_DEFAULT);

const ERROR_WALLET_EXEC = `Failed to start ${config.walletServiceBinaryFilename}. Set the path to ${config.walletServiceBinaryFilename} properly in the settings tab.`;
const ERROR_WALLET_PASSWORD = 'Failed to load your wallet, please check your password';
const ERROR_WALLET_IMPORT = 'Import failed, please check that you have entered all information correctly';
const ERROR_WALLET_CREATE = 'Wallet can not be created, please check your input and try again';
const ERROR_TRANSACTION_CREATE = 'Transaction can not be created, please check your input and try again';
const ERROR_PASSWORD_FORMAT = 'Password must be at least 8 characters long and contain a combination of letters, numbers, and special characters. (?!:.,%+-/*<>{}()[]`"\'~_^\\|@#$&)';
const ERROR_RPC_TIMEOUT = 'Unable to communicate with selected node, please try again in a few seconds or switch to another node address';
const INFO_FUSION_DONE = 'Wallet optimization completed, your balance may appear incorrect for a while.';
const INFO_FUSION_SKIPPED = 'Wallet already optimized. No further optimization is needed.';
const ERROR_FUSION_FAILED = 'Unable to optimize your wallet, please try again in a few seconds';

var SvalinnManager = function () {
    if (!(this instanceof SvalinnManager)) {
        return new SvalinnManager();
    }

    let nodeAddress = settings.get('node_address').split(':');
    this.daemonHost = nodeAddress[0] || null;
    this.daemonPort = nodeAddress[1] || null;
    this.serviceProcess = null;
    this.serviceBin = settings.get('service_bin');
    this.servicePassword = settings.get('service_password');
    this.serviceHost = settings.get('service_host');
    this.servicePort = settings.get('service_port');
    this.serviceTimeout = settings.get('service_timeout');
    this.serviceArgsDefault = ['--rpc-password', settings.get('service_password')];
    this.walletConfigDefault = { 'rpc-password': settings.get('service_password') };
    this.servicePid = null;
    this.serviceLastPid = null;
    this.serviceActiveArgs = [];
    this.serviceApi = null;
    this.syncWorker = null;
    this.fusionTxHash = [];
};

SvalinnManager.prototype.init = function () {
    this._getSettings();
    if (this.serviceApi !== null) return;

    let cfg = {
        service_host: this.serviceHost,
        service_port: this.servicePort,
        service_password: this.servicePassword
    };
    this.serviceApi = new SvalinnApi(cfg);
};

SvalinnManager.prototype._getSettings = function () {
    let nodeAddress = settings.get('node_address').split(':');
    this.daemonHost = nodeAddress[0] || null;
    this.daemonPort = nodeAddress[1] || null;
    this.serviceBin = settings.get('service_bin');
};

SvalinnManager.prototype._reinitSession = function () {
    this._wipeConfig();
    wsession.reset();
    this.notifyUpdate({
        type: 'sectionChanged',
        data: 'reset-oy'
    });
};

SvalinnManager.prototype._serviceBinExists = function () {
    wsutil.isFileExist(this.serviceBin);
};

// check 
SvalinnManager.prototype.serviceStatus = function () {
    return (undefined !== this.serviceProcess && null !== this.serviceProcess);
};

SvalinnManager.prototype.isRunning = function () {
    /*
    this.init();
    let proc = path.basename(this.serviceBin);
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32': cmd = `tasklist`; break;
        case 'darwin': cmd = `ps -ax | grep ${proc}`; break;
        case 'linux': cmd = `ps -A`; break;
        default: break;
    }
    if (cmd === '' || proc === '') return false;

    childProcess.exec(cmd, (err, stdout, stderr) => {
        if (err) log.debug(err.message);
        if (stderr) log.debug(stderr.toLocaleLowerCase());
        let found = stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1;
        log.debug(`Process found: ${found}`);
        return found;
    });
    */
};

SvalinnManager.prototype._writeIniConfig = function (cfg) {
    let configFile = wsession.get('walletConfig');
    if (!configFile) return '';

    try {
        fs.writeFileSync(configFile, cfg);
        return configFile;
    } catch (err) {
        log.error(err);
        return '';
    }
};

SvalinnManager.prototype._writeConfig = function (cfg) {
    let configFile = wsession.get('walletConfig');
    if (!configFile) return '';

    cfg = cfg || {};
    if (!cfg) return '';

    let configData = '';
    Object.keys(cfg).map((k) => { configData += `${k}=${cfg[k]}${os.EOL}`; });
    try {
        fs.writeFileSync(configFile, configData);
        return configFile;
    } catch (err) {
        log.error(err);
        return '';
    }
};

SvalinnManager.prototype._wipeConfig = function () {
    try { fs.unlinkSync(wsession.get('walletConfig')); } catch (e) { }
};

SvalinnManager.prototype.startService = function (walletFile, onError, onSuccess, onDelay) {
    
    const keystore = JSON.parse (fs.readFileSync (walletFile, 'utf8'));

    try {
        wsession.set ('loadedWalletAddress', keystore.address);
        wsession.set ('serviceReady', true);
        onSuccess (walletFile);
    } catch (err) {
        onError ("Error when opening the wallet : " + err);
    }
};

SvalinnManager.prototype._argsToIni = function (args) {
    let configData = "";
    if ("object" !== typeof args || !args.length) return configData;
    args.forEach((k, v) => {
        let sep = ((v % 2) === 0) ? os.EOL : "=";
        configData += `${sep}${k.toString().replace('--', '')}`;
    });
    return configData.trim();
};

SvalinnManager.prototype.stopService = function () {
};

SvalinnManager.prototype.terminateService = function (force) {
};

SvalinnManager.prototype.startSyncWorker = function () {
};

SvalinnManager.prototype.stopSyncWorker = function () {
};

SvalinnManager.prototype.getNodeFee = function () {
};

SvalinnManager.prototype.genIntegratedAddress = function (paymentId, address) {
};

function check_password (password) {
    return /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[?!:\.,%+-/*<>{}\(\)\[\]`"'~_^\\|@#$&]).{8,}$/.test(password)
}

SvalinnManager.prototype.createWallet = function (walletFile, password)
{
    return new Promise ((resolve, reject) => {

        if (!check_password (password)) {
            return reject (new Error (ERROR_PASSWORD_FORMAT));
        }

        // Generate a wallet
        const wallet = new IconService.IconWallet.create();
        const keystore = wallet.store (password);

        // Write keystore to disk
        fs.writeFile (walletFile, JSON.stringify (keystore), function(err) {
            if (err) {
                return reject (new Error (ERROR_WALLET_CREATE));
            }
        });

        return resolve(walletFile);
    });
};

SvalinnManager.prototype.createTransaction = function (tx, transactionFile, walletFile, walletPass)
{
    return new Promise ((resolve, reject) => {

        // Open the wallet
        try {
            const keystore = JSON.parse (fs.readFileSync (walletFile, 'utf8'));
            const wallet = IconService.IconWallet.loadKeystore (keystore, walletPass);

            const icxTransaction = new IconService.IconBuilder.IcxTransactionBuilder()
                .from(tx.from)
                .to(tx.to)
                .value(tx.value)
                .stepLimit(tx.stepLimit)
                .nid(tx.nid)
                .nonce(tx.nonce)
                .version(tx.version)
                .timestamp(tx.timestamp)
                .build();

            const signature = new IconService.SignedTransaction (icxTransaction, wallet).getProperties();

            // Write transaction to disk
            fs.writeFile (transactionFile, JSON.stringify(signature), function(err) {
                if (err) {
                    return reject(err);
                }
            }); 

            return resolve (transactionFile);

        } catch (err) {
            return reject (err);
        }
    });
};

SvalinnManager.prototype.importFromKeys = function (walletFile, password, privateKey)
{
    return new Promise((resolve, reject) =>
    {
        if (!check_password (password)) {
            return reject (new Error (ERROR_PASSWORD_FORMAT));
        }

        const wallet = IconService.IconWallet.loadPrivateKey (privateKey);
        const keystore = wallet.store (password);

        // Write keystore to disk
        fs.writeFile (walletFile, JSON.stringify (keystore), function(err) {
            if (err) {
                return reject (new Error (ERROR_WALLET_CREATE));
            }
        });

        return resolve (walletFile);
    });
};

SvalinnManager.prototype.importFromSeed = function (walletFile, password, mnemonicSeed, scanHeight) {
    this.init();
    let wsm = this;
    return new Promise((resolve, reject) => {
        scanHeight = scanHeight || 0;

        let serviceArgs = wsm.serviceArgsDefault.concat([
            '-g', '-w', walletFile, '-p', password,
            '--mnemonic-seed', mnemonicSeed,
            '--log-level', 0, '--log-file', path.join(remote.app.getPath('temp'), 'ts.log')
        ]);

        if (scanHeight >= 0) serviceArgs = serviceArgs.concat(['--scan-height', scanHeight]);

        childProcess.execFile(
            wsm.serviceBin, serviceArgs, (error, stdout, stderr) => {
                if (stdout) log.debug(stdout);
                if (stderr) log.debug(stderr);

                if (error) {
                    log.debug(`Error importing seed: ${error.message}`);
                    return reject(new Error(ERROR_WALLET_IMPORT));
                } else {
                    if (!wsutil.isRegularFileAndWritable(walletFile)) {
                        return reject(new Error(ERROR_WALLET_IMPORT));
                    }
                    return resolve(walletFile);
                }
            }
        );
    });
};

SvalinnManager.prototype.getSecretKeys = function (walletPass) {

    return new Promise((resolve, reject) => {
        try {
            const walletFile = settings.get ('recentWallet');
            const keystore = JSON.parse (fs.readFileSync (walletFile, 'utf8'));
            const wallet = IconService.IconWallet.loadKeystore (keystore, walletPass);
            return resolve (wallet.getPrivateKey());
        } catch (err) {
            return reject (err);
        }
    });
};

SvalinnManager.prototype.sendTransaction = function (params) {
    let wsm = this;
    return new Promise((resolve, reject) => {
        wsm.serviceApi.sendTransaction(params).then((result) => {
            return resolve(result);
        }).catch((err) => {
            return reject(err);
        });
    });
};

SvalinnManager.prototype.sendSignedTransaction = function (tx) {

    return new Promise((resolve, reject) => {
        try {
            const httpProvider = new IconService.HttpProvider ('http://iconation.team:9000/api/v3');
            const iconService = new IconService (httpProvider);
            txHash = iconService.sendTransaction (tx).execute();
            return resolve (txHash);
        } catch (err) {
            return reject(err);
        }
    });
};

SvalinnManager.prototype.rescanWallet = function (scanHeight) {
    let wsm = this;

    function resetSession() {
        wsession.set('walletUnlockedBalance', 0);
        wsession.set('walletLockedBalance', 0);
        wsession.set('synchronized', false);
        wsession.set('txList', []);
        wsession.set('txLen', 0);
        wsession.set('txLastHash', null);
        wsession.set('txLastTimestamp', null);
        wsession.set('txNew', []);
        let fakeBlock = -300;
        let resetdata = {
            type: 'blockUpdated',
            data: {
                blockCount: fakeBlock,
                displayBlockCount: fakeBlock,
                knownBlockCount: fakeBlock,
                displayKnownBlockCount: fakeBlock,
                syncPercent: fakeBlock
            }
        };
        wsm.notifyUpdate(resetdata);
    }

    return new Promise((resolve) => {
        wsm.serviceApi.reset({ scanHeight: scanHeight }).then(() => {
            resetSession();
            return resolve(true);
        }).catch(() => {
            resetSession();
            return resolve(false);
        });
    });
};

SvalinnManager.prototype._fusionGetMinThreshold = function (threshold, minThreshold, maxFusionReadyCount, counter) {
    let wsm = this;
    return new Promise((resolve, reject) => {
        counter = counter || 0;
        threshold = threshold || (parseInt(wsession.get('walletUnlockedBalance'), 10) * 100) + 1;
        threshold = parseInt(threshold, 10);
        minThreshold = minThreshold || threshold;
        maxFusionReadyCount = maxFusionReadyCount || 0;

        let maxThreshCheckIter = 20;

        wsm.serviceApi.estimateFusion({ threshold: threshold }).then((res) => {
            // nothing to optimize
            if (counter === 0 && res.fusionReadyCount === 0) return resolve(0);
            // stop at maxThreshCheckIter or when threshold too low
            if (counter > maxThreshCheckIter || threshold < 10) return resolve(minThreshold);
            // we got a possibly best minThreshold
            if (res.fusionReadyCount < maxFusionReadyCount) {
                return resolve(minThreshold);
            }
            // continue to find next best minThreshold
            maxFusionReadyCount = res.fusionReadyCount;
            minThreshold = threshold;
            threshold /= 2;
            counter += 1;
            resolve(wsm._fusionGetMinThreshold(threshold, minThreshold, maxFusionReadyCount, counter).then((res) => {
                return res;
            }));
        }).catch((err) => {
            return reject(new Error(err));
        });
    });
};

SvalinnManager.prototype._fusionSendTx = function (threshold, counter) {
    let wsm = this;
    const wtime = ms => new Promise(resolve => setTimeout(resolve, ms));

    return new Promise((resolve, reject) => {
        counter = counter || 0;
        let maxIter = 256;
        if (counter >= maxIter) return resolve(wsm.fusionTxHash); // stop at max iter

        wtime(2400).then(() => {
            // keep sending fusion tx till it hit IOOR or reaching max iter 
            log.debug(`send fusion tx, iteration: ${counter}`);
            wsm.serviceApi.sendFusionTransaction({ threshold: threshold }).then((resp) => {
                wsm.fusionTxHash.push(resp.transactionHash);
                counter += 1;
                return resolve(wsm._fusionSendTx(threshold, counter).then((resp) => {
                    return resp;
                }));
            }).catch((err) => {
                if (typeof err === 'string') {
                    if (!err.toLocaleLowerCase().includes('index is out of range')) {
                        log.debug(err);
                        return reject(new Error(err));
                    }
                } else if (typeof err === 'object') {
                    if (!err.message.toLowerCase().includes('index is out of range')) {
                        log.debug(err);
                        return reject(new Error(err));
                    }
                }

                counter += 1;
                return resolve(wsm._fusionSendTx(threshold, counter).then((resp) => {
                    return resp;
                }));
            });

        });
    });
};

SvalinnManager.prototype.optimizeWallet = function () {
    let wsm = this;
    log.debug('running optimizeWallet');
    return new Promise((resolve, reject) => {
        wsm.fusionTxHash = [];
        wsm._fusionGetMinThreshold().then((res) => {
            if (res <= 0) {
                wsm.notifyUpdate({
                    type: 'fusionTxCompleted',
                    data: INFO_FUSION_SKIPPED,
                    code: 0
                });
                log.debug('fusion skipped');
                log.debug(wsm.fusionTxHash);
                return resolve(INFO_FUSION_SKIPPED);
            }

            log.debug(`performing fusion tx, threshold: ${res}`);

            return resolve(
                wsm._fusionSendTx(res).then(() => {
                    wsm.notifyUpdate({
                        type: 'fusionTxCompleted',
                        data: INFO_FUSION_DONE,
                        code: 1
                    });
                    log.debug('fusion done');
                    log.debug(wsm.fusionTxHash);
                    return INFO_FUSION_DONE;
                }).catch((err) => {
                    let msg = err.message.toLowerCase();
                    let outMsg = ERROR_FUSION_FAILED;
                    switch (msg) {
                        case 'index is out of range':
                            outMsg = wsm.fusionTxHash.length >= 1 ? INFO_FUSION_DONE : INFO_FUSION_SKIPPED;
                            break;
                        default:
                            break;
                    }
                    log.debug(`fusionTx outMsg: ${outMsg}`);
                    log.debug(wsm.fusionTxHash);
                    wsm.notifyUpdate({
                        type: 'fusionTxCompleted',
                        data: outMsg,
                        code: outMsg === INFO_FUSION_SKIPPED ? 0 : 1
                    });
                    return outMsg;
                })
            );
        }).catch((err) => {
            // todo handle this differently!
            log.debug('fusion error');
            return reject((err.message));
        });
    });
};

SvalinnManager.prototype.networkStateUpdate = function (state) {
    if (!this.syncWorker) return;
    log.debug('ServiceProcess PID: ' + this.servicePid);
    if (state === 0) {
        // pause the syncworker, but leave service running
        this.syncWorker.send({
            type: 'pause',
            data: null
        });
    } else {
        this.init();
        // looks like turtle-service always stalled after disconnected, just kill & relaunch it
        let pid = this.serviceProcess.pid || null;
        this.terminateService();
        // remove config
        this._wipeConfig();
        // wait a bit
        setImmediate(() => {
            if (pid) {
                try { process.kill(pid, 'SIGKILL'); } catch (e) { }
                // remove config
                this._wipeConfig();
            }
            setTimeout(() => {
                log.debug(`respawning ${config.walletServiceBinaryFilename}`);
                this.serviceProcess = childProcess.spawn(this.serviceBin, this.serviceActiveArgs);
                // store new pid
                this.servicePid = this.serviceProcess.pid;
                this.syncWorker.send({
                    type: 'resume',
                    data: null
                });
            }, 15000);
        }, 2500);
    }
};

SvalinnManager.prototype.notifyUpdate = function (msg) {
    uiupdater.updateUiState(msg);
};

SvalinnManager.prototype.resetState = function () {
    return this._reinitSession();
};

module.exports = SvalinnManager;
