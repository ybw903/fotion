const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const fs = require("fs");
const isDev = require("electron-is-dev");
const { ipcMain, globalShortcut, dialog } = require("electron");

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

app.whenReady().then(() => {
  globalShortcut.register("CommandOrControl+F", () => {
    mainWindow.webContents.send("fromMain", {
      type: "SEND_SEARCH",
    });
  });
});
// .then(createWindow);

const getDirs = (file, level, rootIdx) => {
  const stat = fs.statSync(file);
  if (stat.isFile()) {
    // md파일이 아닌경우 추가할 것.
    const md = fs.readFileSync(file, "utf-8");
    return {
      name: file.substring(rootIdx),
      type: "file",
      level,
      docs: md,
    };
  }
  if (stat.isDirectory()) {
    const dir = {
      name: file.substring(rootIdx),
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

ipcMain.on("toMain", (evt, args) => {
  if (args.type === "GET_WORKSPACE") {
    const workspace = dialog.showOpenDialogSync(null, {
      properties: ["openDirectory"],
    });
    mainWindow.webContents.send("fromMain", {
      type: "SEND_WORKSPACE",
      workspace: workspace[0],
    });
  }
  if (args.type === "GET_DIRS") {
    const workspaceDir = args.workspace;
    const rootIdx = workspaceDir.lastIndexOf("/");

    const dirs = getDirs(workspaceDir, 0, rootIdx);
    mainWindow.webContents.send("fromMain", {
      type: "SEND_DIRS",
      dirs,
    });
  }

  if (args.type === "SAVE_DOCS") {
    const regExp = new RegExp("/", "g");
    const dir = args.dir.replace(regExp, "\\");
    fs.writeFileSync(dir.substring(1), args.docs, {
      encoding: "utf-8",
    });

    const rootIdx = args.workspace.lastIndexOf("/");
    const dirs = getDirs(args.workspace, 0, rootIdx);
    mainWindow.webContents.send("fromMain", {
      type: "SEND_DIRS",
      dirs,
    });
  }

  if (args.type === "MAKE_FILE") {
    const regExp = new RegExp("/", "g");
    const dir = args.dirName.replace(regExp, "\\");
    if (fs.existsSync(dir)) return;
    fs.writeFileSync(dir, "");
    const rootIdx = args.workSpace.lastIndexOf("/");
    const dirs = getDirs(args.workSpace, 0, rootIdx);
    mainWindow.webContents.send("fromMain", {
      type: "SEND_DIRS",
      dirs,
    });
  }

  if (args.type === "MAKE_DIR") {
    console.log(args);
    const regExp = new RegExp("/", "g");
    const dir = args.dirName.replace(regExp, "\\");
    if (fs.existsSync(dir)) return;
    fs.mkdirSync(dir);
    const rootIdx = args.workSpace.lastIndexOf("/");
    const dirs = getDirs(args.workSpace, 0, rootIdx);
    mainWindow.webContents.send("fromMain", {
      type: "SEND_DIRS",
      dirs,
    });
  }
});
