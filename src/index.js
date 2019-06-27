const { app, BrowserWindow, dialog, shell } = require('electron');
const updater = require('electron-simple-updater');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const checkForUpdates = () => {
  // Avoid checking for updates on first run.
  if (process.argv.length > 1 && process.argv[1] === '--squirrel-firstrun') {
    return;
  }

  updater.on('update-downloaded', (meta) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Cucumber Forge Update',
      message: meta.version,
      detail: 'A new version of Cucumber Forge has been downloaded. Restart the application to apply the updates.',
    };
    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) updater.quitAndInstall();
    });
  });
  updater.on('error', (err) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Retry', 'Cancel'],
      title: 'Update Error',
      message: 'There was a problem updating Cucumber Forge',
      detail: err.message,
    };
    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) updater.checkForUpdates();
    });
  });
  updater.init();
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    title: 'Cucumber Forge',
    icon: `${__dirname}/resources/png/CucumberForge_48.png`,
    webPreferences: {
      enableBlinkFeatures: 'OverlayScrollbars',
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.setMenu(null);
  
  mainWindow.webContents.on('new-window', function(e, url) {
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
