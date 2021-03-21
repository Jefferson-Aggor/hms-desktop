const electron = require("electron");
const { ipcRenderer } = electron;

const username = document.getElementById("username");
const search_form = document.getElementById("search_form");
const search = document.getElementById("search");
const search_output = document.getElementById("search_output");

ipcRenderer.on("loggedUserDetails", function (e, decoded) {
  username.innerText = `${decoded.firstname} ${decoded.lastname}`;
});
