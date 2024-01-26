const { app, Menu, shell } = require("electron");

module.exports = (appWin) => {
  let template = [
    {
      label: "Items",
      submenu: [
        {
          label: "Add New",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            appWin.send("menu-show-modal");
          },
        },
        {
          label: "Read Item",
          accelerator: "CmdOrCtrl+Enter",
          click: () => {
            appWin.send("menu-open-item");
          },
        },
        {
          label: "Delete Item",
          accelerator: "CmdOrCtrl+Backspace",
          click: () => {
            appWin.send("menu-delete-item");
          },
        },
        {
          label: "Open in Browser",
          accelerator: "CmdOrCtrl+Shift+Enter",
          click: () => {
            appWin.send("menu-open-item-native");
          },
        },
        {
          label: "Search Items",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            appWin.send("menu-focus-search");
          },
        },
      ],
    },
    {
      role: "editMenu",
    },
    {
      role: "windowMenu",
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: () => shell.openExternal("https://google.com"),
        },
      ],
    },
  ];

  if (process.platform === "darwin") {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          role: "about",
        },
        {
          type: "separator",
        },
        {
          label: "Services",
          role: "services",
          submenu: [],
        },
        {
          type: "separator",
        },
        {
          label: `Hide ${name}`,
          accelerator: "Command+H",
          role: "hide",
        },
        {
          label: "Hide Others",
          accelerator: "Command+Alt+H",
          role: "hideOthers",
        },
        {
          label: "Show All",
          role: "unhide",
        },
        {
          type: "separator",
        },
        {
          label: `Quit ${name}`,
          accelerator: "Command+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    });
  }

  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
