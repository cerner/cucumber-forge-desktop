const {
  app, BrowserWindow, dialog, shell, ipcMain,
} = require('electron');
const updater = require('electron-simple-updater');
const log = require('electron-log');
const Generator = require('cucumber-forge-report-generator');
const Store = require('electron-store');

const store = new Store();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const checkForUpdates = () => {
  // Avoid checking for updates on first run.
  if (process.argv.length > 1 && process.argv[1] === '--squirrel-firstrun') {
    return;
  }

  updater.on('update-available', (meta) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Update', 'Later'],
      title: 'Cucumber Forge Update',
      message: 'A new version of Cucumber Forge is available!',
      detail: meta.readme,
    };
    const response = dialog.showMessageBoxSync(dialogOpts);
    if (response === 0) {
      // Currently only support auto-updates on Windows
      if (process.platform === 'win32') {
        updater.downloadUpdate();
      } else {
        shell.openExternal('https://github.com/cerner/cucumber-forge-desktop/releases');
      }
    }
  });
  updater.on('update-downloading', (meta) => { // eslint-disable-line no-unused-vars
    mainWindow.webContents.executeJavaScript(`
      toggleLoadingInd();
    `);
  });
  updater.on('update-downloaded', (meta) => { // eslint-disable-line no-unused-vars
    updater.quitAndInstall();
  });
  updater.on('error', (err) => {
    log.error(`There was a problem automatically updating Cucumber Forge [${err.message}]`);
  });
  updater.init();
};

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    title: 'Cucumber Forge',
    icon: `${__dirname}/resources/png/CucumberForge_48.png`,
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.setMenu(null);

  mainWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });
  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Uncomment this to open the Chrome DevTools
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  checkForUpdates();
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

const generator = new Generator();

ipcMain.on('create-report-request', (event, request) => {
  let report = '';
  try {
    report = generator.generate(request.folderPath, request.projectName, request.tag, store.get('gherkinDialect'));
  } catch (error) {
    dialog.showErrorBox('Error Generating Report', error.message);
  }
  event.reply('create-report-reply', report);
});
