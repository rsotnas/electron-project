const { BrowserWindow } = require("electron");

function createNewWindow(url, index) {
  const newWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    maxWidth: 2000,
    maxHeight: 2000,
    backgroundColor: "#DEDEDE",
    webPreferences: {
      nodeIntegration: 1,
      contextIsolation: 0,
    },
  });

  newWindow.loadURL(url);

  // Open the DevTools.
  // newWindow.webContents.openDevTools();

  let readitClose = `
  const { ipcRenderer } = require('electron');
  let readitClose = document.createElement("div");
  readitClose.innerText = "Done";

  readitClose.style.position = "fixed";
  readitClose.style.bottom = "15px";
  readitClose.style.right = "15px";
  readitClose.style.padding = "5px 10px";
  readitClose.style.fontSize = "20px";
  readitClose.style.fontWeight = "bold";
  readitClose.style.background = "dodgerblue";
  readitClose.style.color = "white";
  readitClose.style.borderRadius = "5px";
  readitClose.style.cursor = "pointer";
  readitClose.style.boxShadow = "2px 2px 2px rgba(0,0,0,0.2)";
  readitClose.style.zIndex = "9999";

 
  readitClose.addEventListener("click", (e) => {

    ipcRenderer.send("item-done", ${index});
  });


  document.getElementsByTagName("body")[0].appendChild(readitClose);



  `;

  newWindow.webContents.on("dom-ready", () => {
    newWindow.webContents.executeJavaScript(readitClose);
  });

  return newWindow;
}

module.exports = createNewWindow;
