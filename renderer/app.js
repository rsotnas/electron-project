const { ipcRenderer } = require("electron");
const items = require("./items");

let showModal = document.getElementById("show-modal");
let closeModal = document.getElementById("close-modal");
let modal = document.getElementById("modal");
let addItem = document.getElementById("add-item");
let itemUrl = document.getElementById("url");
let search = document.getElementById("search");

// filter items by title
search.addEventListener("keyup", (e) => {
  Array.from(document.getElementsByClassName("read-item")).forEach((item) => {
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? "flex" : "none";
  });
});

// nvaite item selection with up/down keys
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    items.changeSelection(e.key);
  }
});

const toggleModalButtons = () => {
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = "Add Item";
    closeModal.style.display = "inline";
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = "Adding...";
    closeModal.style.display = "none";
  }
};

showModal.addEventListener("click", (e) => {
  modal.style.display = "flex";
  itemUrl.focus();
});

closeModal.addEventListener("click", (e) => {
  modal.style.display = "none";
});

addItem.addEventListener("click", (e) => {
  if (itemUrl.value) {
    ipcRenderer.send("new-item", itemUrl.value);
    toggleModalButtons();
  }
});

ipcRenderer.on("new-item-success", (e, newItem) => {
  toggleModalButtons();
  itemUrl.value = "";
  modal.style.display = "none";

  items.add(newItem, true);
});

itemUrl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addItem.click();
});

// disable send button if itemUrl.value is not a valid URL
itemUrl.addEventListener("keyup", (e) => {
  let text = itemUrl.value;
  // regex must have .something
  let regex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (text.match(regex)) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
  }
});
