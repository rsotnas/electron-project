// Modules
const { app, BrowserWindow, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");
const readItem = require("./functions/readItem");
const createNewWindow = require("./functions/createNewWindow");
const appMenu = require("./menu");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let childWindows = [];

ipcMain.on("new-item", (e, itemURL) => {
  readItem(itemURL, (item) => {
    // console.log("sending new-item-success");
    e.sender.send("new-item-success", item);
  });
});

ipcMain.on("item-done", (e, index) => {
  // close the window
  childWindows[index].close();
  childWindows[index] = null;
  // childWindows.splice(index, 1);
  // if every child is null, them empty the array
  if (childWindows.every((child) => child === null)) {
    childWindows = [];
  }
  console.log("childWindows", childWindows);

  // destroy the window
});

ipcMain.on("open-item", (e, itemURL) => {
  // get index of item
  let index = childWindows.length;

  childWindows.push(createNewWindow(itemURL, index));
});

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650,
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 300,
    // frame: false,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,
    },
    // show: false
  });

  appMenu(mainWindow.webContents);

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("renderer/main.html");

  mainWindowState.manage(mainWindow);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    console.log("url", url);
    return { action: "allow" };
  });

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Show window when page is ready
  // mainWindow.on('ready-to-show', () => {
  //   mainWindow.show()
  // })

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on("ready", createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
