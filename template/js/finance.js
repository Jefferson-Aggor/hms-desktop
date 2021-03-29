const electron = require("electron");
const axios = require("axios");
const { ipcRenderer } = electron;

const {
  show_and_hide,
  getInitials,
  splitDate,
} = require("../../helpers/helpers");
const { UI } = require("../../classes/UI");

const username = document.getElementById("username");
const search_form = document.getElementById("search_form");
const search = document.getElementById("search");
const loader = document.getElementById("loader");
const alerts = document.getElementById("alerts");

ipcRenderer.on("loggedUserDetails", function (e, decoded) {
  username.innerText = `${decoded.firstname} ${decoded.lastname}`;
});

ipcRenderer.on("loadedPatient", (e, data) => {
  data === true
    ? (loader.style.display = "none")
    : (loader.style.display = "block");
});

const ui = new UI();

search_form.addEventListener("submit", searchUser);

async function searchUser(e) {
  e.preventDefault();
  const search_val = search.value;

  let url;
  let split = search_val.split(" ");

  loader.style.display = "block";

  if (split.length === 1)
    url =
      "https://hms-project.herokuapp.com/api/members/?firstname=" + split[0];
  else if (split.length > 1)
    url =
      "https://hms-project.herokuapp.com/api/members/?firstname=" +
      split[0] +
      "&" +
      "lastname=" +
      split[1];

  try {
    const client = await axios.get(url);
    let data = client.data.data;

    loader.style.display = "none";
    ui.showSearchedUsers(data);

    const btns = document.querySelectorAll("#view_financial_details");
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        loader.style.display = "block";
        ipcRenderer.send("financial:view_details", e.target.dataset.id);
      });
    });
  } catch (err) {
    loader.style.display = "none";
    search_output.innerHTML = `
        <div class='error-action'>
            <div >${search_error(
              "User not found",
              "fas fa-user-alt-slash",
              "#c51d1d"
            )}
            </div>
           
        </div>
      `;
  }
}
