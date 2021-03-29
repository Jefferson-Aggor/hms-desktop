const axios = require("axios");
const electron = require("electron");

const { ipcRenderer } = electron;

const {
  splitTexts,
  splitDate,
  getInitials,
  search_error,
} = require("../../helpers/helpers");

const username = document.getElementById("username");
const search_form = document.getElementById("search_form");
const search = document.getElementById("search");
const search_output = document.getElementById("search_output");
const loader = document.getElementById("loader");

ipcRenderer.on("loggedUserDetails", function (e, decoded) {
  username.innerText = `${decoded.firstname} ${decoded.lastname}`;
});

ipcRenderer.on("patient:loaded", function (e, data) {
  if (data) loader.style.display = "none";
});

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
    const patients = await axios.get(url);
    loader.style.display = "none";

    search_output.innerHTML = patients.data.data.map((patient) => {
      const temp = ` 
        <div class="card" >
                <div class="search_output_img">
                  <p class='image'> ${getInitials(
                    patient.firstname,
                    patient.lastname
                  )}</p>
                  <div class="search_output_info">
                  <p class="heading_text">
                  ${patient.firstname} ${patient.lastname}</p>
                 
                  <p class='search_output_date'>Joined Since : ${splitDate(
                    patient.joinedAt,
                    "/"
                  )}</p>
                </div>
                </div>
                
                ${
                  patient.paid & patient.lab_results.paidForLab
                    ? `<i class='fas fa-chevron-right fa-5x assign_btn' id='btn' data-id=${patient._id}></i>`
                    : `<i class='fas fa-ban fa-5x assign_btn' style='color:#c51d1d'></i>`
                }
          </div>
        `;

      return temp;
    });

    const btns = document.querySelectorAll("#btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        loader.style.display = "block";
        ipcRenderer.send("lab:patient", e.target.dataset.id);
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
