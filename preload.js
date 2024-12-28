const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("api", {
    IS_ELECTRON_ENV: true,
    ELECTRON_DIRNAME: __dirname
});