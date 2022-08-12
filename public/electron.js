const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const fs = require("fs");
const isDev = require("electron-is-dev");
const { ipcMain } = require("electron");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: isDev,
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.setResizable(true);
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.focus();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("toMain", (evt, args) => {
  if (args.type === "GET_DIRS") {
    const desktopDir = app.getPath("desktop");
    const workspaceDir = `${desktopDir}/a-did`;
    let fileNames = [];
    fs.readdir(workspaceDir, (err, files) => {
      files.forEach((file) => fileNames.push(file));
      console.log(fileNames);
      mainWindow.webContents.send("fromMain", {
        type: "SEND_DIRS",
        fileNames,
      });
    });
  }
});
