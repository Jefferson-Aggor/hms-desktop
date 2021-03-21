const electron = require("electron");
const axios = require("axios");

const { ipcRenderer } = electron;

// event handlers;
const form = document.getElementById("form");
const email = document.getElementById("user_email");
const password = document.getElementById("user_password");
const loader = document.getElementById("loader");
const welcome_text = document.getElementById("welcome_text");
const rootUrl = "https://hms-project.herokuapp.com/api/";

let prevText = welcome_text.textContent;

form.addEventListener("submit", getLogin);

async function getLogin(e) {
  e.preventDefault();
  const data = {
    email: email.value,
    password: password.value,
  };

  loader.style.display = "block";

  try {
    const getLoginData = await axios.post(
      `https://hms-project.herokuapp.com/api/workers/login/`,
      data
    );

    const token = getLoginData.data.token;
    console.log(token);

    ipcRenderer.send("login:token", token);
  } catch (err) {
    loader.style.display = "none";
    const errData = err.toString().trim().split(":");
    welcome_text.style.borderWidth = "2px";

    welcome_text.style.borderStyle = "2px";

    welcome_text.style.borderColor = "#ff5a5f";

    welcome_text.style.color = "#ff5a5f";

    welcome_text.textContent = `${errData[1]}`;
    setTimeout(() => {
      welcome_text.style.color = "#777";
      welcome_text.textContent = prevText;
      welcome_text.style.borderColor = "#00afb9";
    }, 6000);
  }
}

// const getData = async function(){
//     const login = await axios.post(`${rootUrl}/workers/login/`,)
// }
