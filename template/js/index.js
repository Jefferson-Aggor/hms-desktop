const electron = require("electron");
const axios = require("axios");
const { ipcRenderer } = electron;

const {
  show_and_hide,
  splitDate,
  getInitials,
  showCurrent,
  search_error,
} = require("../../helpers/helpers");

const username = document.getElementById("username");
const search_form = document.getElementById("search_form");
const register_form = document.getElementById("register_form");
const search_output = document.getElementById("search_output");
const search = document.getElementById("search");
const loader = document.getElementById("loader");
const alerts = document.getElementById("alerts");
const search_patient = document.getElementById("search-patient");
const register_patient = document.getElementById("register-patient");
const search_icon = document.getElementById("search-icon");
const register_icon = document.getElementById("register-icon");

register_patient.style.display = "none";

show_and_hide(register_icon, register_patient, search_patient);
show_and_hide(search_icon, search_patient, register_patient);

showCurrent("#fff", search_icon, register_icon);

ipcRenderer.on("loggedUserDetails", function (e, decoded) {
  username.innerText = `${decoded.firstname} ${decoded.lastname}`;
});

// Form handlers
search_form.addEventListener("submit", searchUser);
register_form.addEventListener("submit", registerUser);

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
    const patient = await axios.get(url);

    loader.style.display = "none";
    console.log(patient);
    if (patient.data.count !== 0) {
      const temp = patient.data.data.map((patient) => {
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
                  patient.paid
                    ? `<i class='fas fa-chevron-right fa-5x assign_btn' id='assign_doctor_btn' data-id=${patient._id}></i>`
                    : `<i class='fas fa-ban fa-5x assign_btn' style='color:#c51d1d'></i>`
                }
          </div>
        `;

        return temp;
      });

      search_output.innerHTML = temp;

      const btns = document.querySelectorAll("#assign_doctor_btn");
      btns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
          loader.style.display = "block";
          e.preventDefault();
          ipcRenderer.send("patient", e.target.dataset.id);

          ipcRenderer.on("patient:loaded", (e, data) => {
            if (data) loader.style.display = "none";
          });
        });
      });
    } else {
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
  } catch (err) {
    loader.style.display = "none";
    search_output.innerHTML = search_error(err);
  }
}

let patient_data;
async function registerUser(e) {
  e.preventDefault();

  const form = document.forms.register_form;
  const formData = new FormData(form);
  patient_data = {
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    contact: formData.get("contact"),
    marital_status: formData.get("marital_status"),
    emergencyContact: formData.get("emergencyContact"),
    date_of_birth: formData.get("date_of_birth"),
    area_of_residence: formData.get("area_of_residence"),
    occupation: formData.get("occupation"),
  };

  try {
    loader.firstElementChild.innerText =
      "Registering " + " " + patient_data.firstname;

    loader.style.display = "block";

    const register = await axios.post(
      `https://hms-project.herokuapp.com/api/register`,
      patient_data
    );

    loader.style.display = "none";
    alerts.style.display = "block";
    alerts.innerHTML = `<p class='alert-success'>Patient registered...</p>`;

    setTimeout(() => {
      alerts.style.display = "none";
    }, 2000);
  } catch (err) {
    loader.style.display = "none";

    console.log(err);
  }
}
