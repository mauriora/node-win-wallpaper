'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

/**
 * @summary Creates the main window
 * @function
 * @public
 *
 */
const createWindow = function() {
  const windowProperties = {
    webPreferences: {
      nodeIntegration: true
    },
    width: 800,
    height: 600
  };

  mainWindow = new BrowserWindow(windowProperties);
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});
