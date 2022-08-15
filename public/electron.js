const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const fs = require("fs");
const isDev = require("electron-is-dev");
const { ipcMain, globalShortcut } = require("electron");

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

app
  .whenReady()
  .then(() => {
    globalShortcut.register("CommandOrControl+F", () => {
      mainWindow.webContents.send("fromMain", {
        type: "SEND_SEARCH",
      });
    });
  })
  .then(createWindow);

ipcMain.on("toMain", (evt, args) => {
  if (args.type === "GET_DIRS") {
    const desktopDir = app.getPath("desktop");
    const workspaceDir = `${desktopDir}/a-did`;
    const getDirs = (file, level) => {
      const stat = fs.statSync(file);
      if (stat.isFile()) {
        // md파일이 아닌경우 추가할 것.
        const md = fs.readFileSync(file, "utf-8");
        return {
          name: file.substring(desktopDir.length),
          type: "file",
          level,
          docs: md,
        };
      }
      if (stat.isDirectory()) {
        const dir = {
          name: file.substring(desktopDir.length),
          type: "dir",
          files: [],
          level,
        };
        fs.readdirSync(file).forEach((nextFile) => {
          const nextDirs = getDirs(`${file}/${nextFile}`, level + 1);
          dir.files.push(nextDirs);
        });
        return dir;
      }
    };

    const dirs = getDirs(workspaceDir, 0);
    mainWindow.webContents.send("fromMain", {
      type: "SEND_DIRS",
      dirs,
    });
  }
});
