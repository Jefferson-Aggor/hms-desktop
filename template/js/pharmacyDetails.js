const electron = require("electron");
const axios = require("axios");
const { ipcRenderer } = electron;

const { splitTexts, search_error } = require("../../helpers/helpers");

const loader = document.getElementById("loader");
const submitBtn = document.querySelector(".submit-drug-btn");
const pharmacy_output = document.querySelector(".pharmacy-output");

ipcRenderer.on("pharmacy:patient-details", (e, data) => {
  if (Object.keys(data[0].consultation.diagnosis).includes("prescriptions")) {
    let prescriptions = splitTexts(
      data[0].consultation.diagnosis.prescriptions
    );
    pharmacy_output.innerHTML = prescriptions.map((prescription) => {
      return `
      <div class="pharmacy-output-item">
        <i class="fas fa-pills"></i>
        <p class="drug-name">${prescription}</p>
      </div>`;
    });
  } else if (data[0].consultation.diagnosis.prescription == null) {
    // submitBtn.style.display = "none";
    pharmacy_output.innerHTML = `<div class="pharmacy-output-item">
    <i class="fas fa-pills"></i>
    <p class="drug-name" style='color:orangered'>No presciption</p>
  </div>`;
  }

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    loader.style.display = "block";
    try {
      const patient = await axios.put(
        `hms-project.herokuapp.com/api/user/${data[0]._id}/pharmacy`,
        {}
      );
      loader.style.display = "none";
      console.log(patient);
    } catch (err) {
      submitBtn.style.display = "none";
      loader.style.display = "none";

      pharmacy_output.innerHTML = search_error(err);
    }
  });
});
