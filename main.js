const { app, Tray, Menu, MenuItem, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const platform = require('os').platform();
const Store = require('electron-store');
const settings = new Store({ name: 'Settings' });
const log = require('electron-log');
const splash = require('@trodi/electron-splashscreen');
const config = require('./src/js/ws_config');

const IS_DEV = (process.argv[1] === 'dev' || process.argv[2] === 'dev');
const IS_DEBUG = IS_DEV || process.argv[1] === 'debug' || process.argv[2] === 'debug';
const LOG_LEVEL = IS_DEBUG ? 'debug' : 'warn';
const WALLET_CFGFILE = path.join(app.getPath('userData'), 'wconfig.txt');
const SVALINN_VERSION = app.getVersion();

const DEFAULT_SETTINGS = {
    tray_minimize: false,
    tray_close: false,
    darkmode: false,
};
const DEFAULT_SIZE = { width: 840, height: 840 }; 
const WIN_TITLE = `${config.appName} ${SVALINN_VERSION} - ${config.appDescription}`;

// language list in order
const LOCALE_LIST = require("./src/js/i18n/lang-config.json").order;

app.prompExit = true;
app.prompShown = false;
app.needToExit = false;
app.debug = IS_DEBUG;
app.walletConfig = WALLET_CFGFILE;
app.setAppUserModelId(config.appId);

log.transports.console.level = LOG_LEVEL;
log.transports.file.level = LOG_LEVEL;
log.transports.file.maxSize = 5 * 1024 * 1024;
log.info(`Starting Svalinn ${SVALINN_VERSION}`);
if (IS_DEV || IS_DEBUG) log.warn(`Running in ${IS_DEV ? 'dev' : 'debug'} mode`);

let trayIcon = path.join(__dirname, 'src/assets/tray.png');
let trayIconHide = path.join(__dirname, 'src/assets/trayon.png');

let win;
let tray;

function createWindow()
{
    // Create the browser window.
    let darkmode = settings.get('darkmode', false);
    let bgColor = darkmode ? '#000000' : '#02853E';

    const winOpts = {
        title: WIN_TITLE,
        icon: path.join(__dirname, 'src/assets/svalinn_icon.png'),
        frame: true,
        width: DEFAULT_SIZE.width,
        height: DEFAULT_SIZE.height,
        minWidth: DEFAULT_SIZE.width,
        minHeight: DEFAULT_SIZE.height,
        show: false,
        backgroundColor: bgColor,
        center: true,
        autoHideMenuBar: false,
        menuBarVisibility: false,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true,
            nodeIntegration: true
        },
    };

    win = splash.initSplashScreen({
        windowOpts: winOpts,
        templateUrl: path.join(__dirname, "src/html/splash.html"),
        delay: 0,
        minVisible: 800,
        splashScreenOpts: {
            width: 425,
            height: 325,
            transparent: true
        },
    });

    //load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/html/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // open devtools
    if (IS_DEV) win.webContents.openDevTools();

    // show window
    win.once('ready-to-show', () => {
        //win.show();
        win.setTitle(WIN_TITLE);
        if (platform !== 'darwin') {
            tray.setToolTip(config.appSlogan);
        }
    });

    win.on('close', (e) => {
        if ((settings.get('tray_close') && !app.needToExit && platform !== 'darwin')) {
            e.preventDefault();
            win.hide();
        } else if (app.prompExit) {
            e.preventDefault();
            app.prompExit = false;
            win.webContents.send('cleanup', 'Clean it up, Dad!');
        }
    });

    if (platform !== 'darwin') {
        let contextMenu = Menu.buildFromTemplate([
            { label: 'Minimize to tray', click: () => { win.hide(); } },
            {
                label: 'Quit', click: () => {
                    app.needToExit = true;
                    if (win) {
                        win.close();
                    } else {
                        process.exit(0);
                    }
                }
            }
        ]);

        tray = new Tray(trayIcon);
        tray.setPressedImage(trayIconHide);
        tray.setTitle(config.appName);
        tray.setToolTip(config.appSlogan);
        tray.setContextMenu(contextMenu);

        tray.on('click', () => {
            if(!win.isFocused() && win.isVisible()){
                win.focus();
            }else if (settings.get('tray_minimize', false)) {
                if (win.isVisible()) {
                    win.hide();
                } else {
                    win.show();
                }
            } else {
                if (win.isMinimized()) {
                    win.restore();
                    win.focus();
                } else {
                    win.minimize();
                }
            }
        });

        win.on('show', () => {
            tray.setHighlightMode('always');
            tray.setImage(trayIcon);
            contextMenu = Menu.buildFromTemplate([
                { label: 'Minimize to tray', click: () => { win.hide(); } },
                {
                    label: 'Quit', click: () => {
                        app.needToExit = true;
                        win.close();
                    }
                }
            ]);
            tray.setContextMenu(contextMenu);
            tray.setToolTip(config.appSlogan);
        });

        win.on('hide', () => {
            tray.setHighlightMode('never');
            tray.setImage(trayIconHide);
            if (platform === 'darwin') return;

            contextMenu = Menu.buildFromTemplate([
                { label: 'Restore', click: () => { win.show(); } },
                {
                    label: 'Quit', click: () => {
                        app.needToExit = true;
                        win.close();
                    }
                }
            ]);
            tray.setContextMenu(contextMenu);
        });

        win.on('minimize', (event) => {
            if (settings.get('tray_minimize') && platform !== 'darwin') {
                event.preventDefault();
                win.hide();
            }
        });
    }

    win.on('closed', () => {
        win = null;
    });

    win.setMenu(null);
  
    //i18n menu
    i18nMenu(LOCALE_LIST);

    // misc handler
    win.webContents.on('crashed', () => {
        // todo: prompt to restart
        log.debug('webcontent was crashed');
    });

    win.on('unresponsive', () => {
        // todo: prompt to restart
        log.debug('webcontent is unresponsive');
    });
}

function initSettings() {
    Object.keys(DEFAULT_SETTINGS).forEach((k) => {
        if (!settings.has(k) || settings.get(k) === null) {
            settings.set(k, DEFAULT_SETTINGS[k]);
        }
    });
    settings.set('version', SVALINN_VERSION);
}

app.on('browser-window-created', function (e, window) {
    window.setMenuBarVisibility(false);
    window.setAutoHideMenuBar(false);
});
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    //if (platform !== 'darwin')
    app.quit();
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) createWindow();
});

process.on('uncaughtException', function (e) {
    log.error(`Uncaught exception: ${e.message}`);
    try { fs.unlinkSync(WALLET_CFGFILE); } catch (e) { }
    process.exit(1);
});

process.on('beforeExit', (code) => {
    log.debug(`beforeExit code: ${code}`);
});

process.on('exit', (code) => {
    // just to be sure
    try { fs.unlinkSync(WALLET_CFGFILE); } catch (e) { }
    log.debug(`exit with code: ${code}`);
});

process.on('warning', (warning) => {
    log.warn(`${warning.code}, ${warning.name}`);
});

const silock = app.requestSingleInstanceLock();
app.on('second-instance', () => {
    if (win) {
        if (!win.isVisible()) win.show();
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});
if (!silock) app.quit();

app.on('ready', () => {
    initSettings();
    createWindow();
    // try to target center pos of primary display
    let eScreen = require('electron').screen;
    let primaryDisp = eScreen.getPrimaryDisplay();
    let tx = Math.ceil((primaryDisp.workAreaSize.width - DEFAULT_SIZE.width) / 2);
    let ty = Math.ceil((primaryDisp.workAreaSize.height - (DEFAULT_SIZE.height)) / 2);
    if (tx > 0 && ty > 0) {
        try { win.setPosition(parseInt(tx, 10), parseInt(ty, 10)); } catch (_e) { }
    }
});

function i18nMenu(locales) {
  //contextual menu for when clicking on the language button
  const _langContext = new Menu();
  for (let each of locales) {
    _langContext.append(new MenuItem({label: each, click: changeAppLanguage}));
  };

  ipcMain.on('select-lang', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    _langContext.popup(win);
  });
}

function changeAppLanguage(selectedLang) {
  //Sends a message from the main process to the renderer process with the language that the user selected
  let lang = selectedLang.label;
  win.webContents.send('change-lang', lang);
}