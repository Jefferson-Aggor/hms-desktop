const electron = require("electron");
const axios = require("axios");
const { ipcRenderer } = electron;

const username = document.getElementById("username");
const search_form = document.getElementById("search_form");
const search = document.getElementById("search");
const search_output = document.getElementById("search_output");
const loader = document.getElementById("loader");

const { search_error } = require("../../helpers/helpers");

ipcRenderer.on("loggedUserDetails", function (e, decoded) {
  username.innerText = `${decoded.firstname} ${decoded.lastname}`;
});

search_form.addEventListener("submit", searchUser);

async function searchUser(e) {
  e.preventDefault();
  const search_val = search.value;

  console.log(search_val);
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
                  <div class=" search_output_img">
                    <p> ${getInitials(patient.firstname, patient.lastname)}</p>
                  </div>
                  <div class="search_output_info">
                    <p class="heading_text">
                    ${patient.firstname} ${patient.lastname}</p>
                    <div class="divider-sm"></div>
                    <p>${splitDate(patient.joinedAt, "-")}</p>
                  </div>
                  ${
                    patient.paid && patient.paidForDrugs
                      ? `<a href="" class="btn" id='view_pharmacy_details' data-id=${patient._id} >View Patient</a> `
                      : `<a href="" class="btn" id='view_pharmacy_details' data-id=${patient._id} disabled>Not Paid</a>`
                  }
                  
                </div>
        `;

      return temp;
    });

    const btns = document.querySelectorAll(".btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        loader.style.display = "block";
        ipcRenderer.send("consultation:patient", e.target.dataset.id);
      });
    });
  } catch (err) {
    loader.style.display = "none";
    search_output.innerHTML = search_error(err);
    console.log(err);
  }
}
