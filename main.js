const { app, BrowserWindow } = require('electron');
const path = require('node:path');

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '/build/index.html'));
    } else {
        mainWindow.loadURL("http://localhost:3000");
    }
}

app.whenReady().then(createWindow);