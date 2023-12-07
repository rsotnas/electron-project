const { BrowserWindow } = require("electron");

let offscreenWindow;

module.exports = (url, callback) => {
  // Create offscreen window
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      offscreen: true,
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // Load item url

  offscreenWindow.loadURL(url);

  // Wait for content to finish loading
  offscreenWindow.webContents.on("did-finish-load", (e) => {
    // Get page title
    let title = offscreenWindow.getTitle();

    // Get screenshot (thumbnail)
    offscreenWindow.webContents.capturePage().then((image) => {
      // Get image as dataURL
      let screenshot = image.toDataURL();

      // Execute callback with new item object
      callback({ title, screenshot, url });

      // Clean up
      offscreenWindow.close();
      offscreenWindow = null;
    });
  });
};
