const axios = require("axios");
const electron = require("electron");
const { ipcRenderer } = electron;

const {
  show_and_hide,
  append_text,
  splitTexts,
  search_error,
} = require("../../helpers/helpers");

const loader = document.getElementById("loader");
const patient_name = document.getElementById("patient_name");
const patient_diagnosis_handler = document.getElementById("patient-disgnosis");
const consultation_details = document.querySelector("#consultation-details");
const lab_details_body = document.querySelector("#lab-details");
const consultation_handler = document.getElementById("consultation-handler");
const lab_tests_handler = document.getElementById("lab-tests-handler");
const checkbox = document.getElementById("checkbox");
const prescriptionHandler = document.getElementById("prescriptions");
const alert_warning = document.getElementById("alert-warning");
const symptoms_output = document.getElementById("symptoms-output");
const lab_tests_to_handle = document.getElementById("lab_tests_to_handle");
const lab_tests_placeholder = document.querySelector(".lab-tests");
const patient_item_name = document.querySelector(".patient-item-name");
const num_tests = document.getElementById("num_tests");
const num_symptoms = document.getElementById("num_symptoms");
const run_lab = document.querySelector("#run_lab");
const prescriptions = document.getElementById("prescription");
const lab_results = document.getElementById("lab-results");
const diagnose_handler = document.getElementById("diagnose-handler");
const alert_success = document.querySelector(".alert-success");

const btn = document.querySelector(".btn");

lab_details_body.style.display = "none";
alert_warning.style.display = "none";
show_and_hide(consultation_handler, consultation_details, lab_details_body);

let assigned_to_lab = "no";
run_lab.style.display = "none";
lab_results.style.display = "none";
prescriptionHandler.style.display = "block";
alert_success.style.display = "none";

checkbox.addEventListener("change", (e) => {
  if (e.target.checked) {
    show_and_hide(lab_tests_handler, lab_details_body, consultation_details);
    lab_details_body.style.display = "block";
    alert_warning.style.display = "block";
    consultation_details.style.display = "none";
    btn.style.display = "none";
    prescriptionHandler.style.display = "none";
    run_lab.style.display = "block";
  } else {
    lab_details_body.style.display = "none";
    alert_warning.style.display = "none";
    consultation_details.style.display = "block";
    btn.style.display = "block";
    prescriptionHandler.style.display = "block";
    run_lab.style.display = "none";
  }
});

append_text(patient_diagnosis_handler, symptoms_output, num_symptoms);
append_text(lab_tests_to_handle, lab_tests_placeholder, num_tests);

ipcRenderer.on("consultation:details", (e, data) => {
  patient_name.value = `${data[0].firstname} ${data[0].lastname}`;
  patient_item_name.innerText = `${data[0].firstname} ${data[0].lastname}`;

  console.log(data[0]);
  const { symptoms, lab_tests, referToLab } = data[0].consultation.diagnosis;

  if (referToLab) {
    prescriptions.style.display = "none";
  }

  if (
    Object.keys(data[0].consultation.diagnosis).includes("symptoms") &&
    symptoms.length !== ""
  ) {
    symptoms_output.innerHTML = splitTexts(symptoms).map((text) => {
      return `<ul class="patient-details-menu" id="patient-details-menu">
      <li class="patient-details-menu-item">${text}</li> 
    </ul>`;
    });
  }

  if (
    Object.keys(data[0].consultation.diagnosis).includes("lab_tests") &&
    lab_tests.length !== ""
  ) {
    lab_tests_placeholder.innerHTML = splitTexts(lab_tests).map((text) => {
      return `<ul class="patient-details-menu" id="patient-details-menu">
      <li class="patient-details-menu-item">${text}</li> 
    </ul>`;
    });
  }

  if (
    referToLab &&
    Object.keys(data[0].lab_results).includes("titles") &&
    data[0].lab_results.titles !== ""
  ) {
    prescriptions.style.display = "block";

    const splitText = data[0].lab_results.titles.split(",");

    lab_results.innerHTML = splitText.map((text) => {
      return `<ul class="patient-details-menu" id="patient-details-menu">
      <li class="patient-details-menu-item">${text}</li> 
    </ul>`;
    });

    lab_results.style.display = "block";
  } else {
    prescriptions.style.display = "none";
    alert_warning.style.display = "block";
  }

  let val;
  let symptoms_;

  val = lab_tests_to_handle.value;

  symptoms_ = patient_diagnosis_handler.value;

  if (checkbox.checked) {
    assigned_to_lab = "yes";
  }

  // Update lab tests
  run_lab.addEventListener("click", async (e) => {
    e.preventDefault();
    loader.style.display = "block";

    const patient = await axios.put(
      `https://hms-project.herokuapp.com/api/user/${data[0]._id}/consultation/`,
      { referToLab: assigned_to_lab, lab_tests: val, symptoms: symptoms_ }
    );

    loader.style.display = "none";
    lab_details_body.style.display = "none";
    alert_warning.style.display = "none";
    consultation_details.style.display = "block";

    checkbox.checked = false;

    console.log(patient.data.data);
  });

  // Handle Prescriptions
  diagnose_handler.addEventListener("click", async (e) => {
    e.preventDefault();
    let prescriptions;

    prescriptions = document.getElementById("prescription-handler").value;

    try {
      loader.style.display = "block";
      const patient = await axios.put(
        `https://hms-project.herokuapp.com/api/user/${data[0]._id}/consultation/`,
        {
          referToLab: assigned_to_lab,
          lab_tests: val,
          symptoms: symptoms_,
          prescriptions,
        }
      );

      loader.style.display = "none";
      alert_success.innerHTML = `<p>Diagnosis Successful...</p>`;
      console.log(patient.data.data);
    } catch (err) {
      console.log(err);
    }
  });
});
