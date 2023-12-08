const { ipcRenderer } = require("electron");

let items = document.getElementById("items");

window.addEventListener("message", (e) => {
  console.log("message", e.data);
});

exports.storage = localStorage.getItem("readit-items")
  ? JSON.parse(localStorage.getItem("readit-items"))
  : [];

exports.save = () => {
  localStorage.setItem("readit-items", JSON.stringify(this.storage));
};

exports.select = (e) => {
  document
    .getElementsByClassName("read-item selected")[0]
    .classList.remove("selected");

  e.currentTarget.classList.add("selected");
};

exports.open = () => {
  if (!this.storage.length) return;

  let selectedItem = document.getElementsByClassName("read-item selected")[0];

  let contentURL = selectedItem.dataset.url;

  ipcRenderer.send("open-item", contentURL);
};

exports.add = (item, isNew = false) => {
  let itemNode = document.createElement("div");

  itemNode.setAttribute("class", "read-item");

  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

  items.appendChild(itemNode);

  itemNode.addEventListener("click", this.select);

  itemNode.setAttribute("data-url", item.url);

  itemNode.addEventListener("dblclick", this.open);

  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

this.storage.forEach((item) => {
  this.add(item, false);
});

exports.changeSelection = (direction) => {
  let currentItem = document.getElementsByClassName("read-item selected")[0];

  if (direction === "ArrowUp" && currentItem.previousElementSibling) {
    currentItem.classList.remove("selected");
    currentItem.previousElementSibling.classList.add("selected");
  } else if (direction === "ArrowDown" && currentItem.nextElementSibling) {
    currentItem.classList.remove("selected");
    currentItem.nextElementSibling.classList.add("selected");
  }
};
