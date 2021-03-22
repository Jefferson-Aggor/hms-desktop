const electron = require("electron");
const axios = require("axios");
const { ipcRenderer } = electron;

const { splitTexts, search_error } = require("../../helpers/helpers");

const loader = document.getElementById("loader");
const submitBtn = document.querySelector(".submit-drug-btn");
const pharmacy_output = document.querySelector(".pharmacy-output");
const pharmacy = document.getElementById("pharmacy");

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
        `https://hms-project.herokuapp.com/api/user/${data[0]._id}/pharmacy`,
        {}
      );
      if (patient.data === `Thank you for using our services. Stay safe`) {
        loader.style.display = "none";
        pharmacy.innerHTML = `
        <section class="success">
      <i class="fas fa-check"></i>
      <h1 class="title">${patient.data}</h1>
      <p>Close Window</p>
    </section>
        `;
      }
    } catch (err) {
      submitBtn.style.display = "none";
      loader.style.display = "none";

      pharmacy_output.innerHTML = search_error(err);
    }
  });
});
