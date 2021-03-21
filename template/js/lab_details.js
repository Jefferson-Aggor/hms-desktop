const axios = require("axios");
const electron = require("electron");
const { ipcRenderer } = electron;

const { splitTexts, show_and_hide } = require("../../helpers/helpers");

const labDetailsBody = document.getElementById("lab-details-body");
const lab_form = document.getElementById("lab-form");
const lab_form_details = document.getElementById("lab-form-details");
const back = document.getElementById("back");
const loader = document.getElementById("loader");
const alert = document.querySelector(".alert");
// const search_form = document.getElementById("search_form");
// const search = document.getElementById("search");
// const testType = document.querySelector(".test-type");
// const btn = document.querySelector(".btn");

lab_form.style.display = "none";
ipcRenderer.on("lab:details", (e, data) => {
  let lab_results = "";

  console.log(data[0]);
  labDetailsBody.innerHTML = lab_layout(data[0]);

  const tests = splitTexts(data[0].consultation.diagnosis.lab_tests);

  lab_form_details.innerHTML = tests.map((test) => {
    const temp = `<form action="" class="form" id="search_form">
        <p class="test-type">${test}</p>
        <div class="form-body">
          <input type="text" class="form-input block" id="${test}" placeholder = "Enter ${test} results " />
        </div>
      </form>`;
    return temp;
  });

  const proceed = document.getElementById("proceed_to_tests");
  if (proceed !== null) {
    show_and_hide(proceed, lab_form, labDetailsBody);
  }
  show_and_hide(back, labDetailsBody, lab_form);

  const btn = document.querySelector(".submit");
  const input_forms = document.querySelectorAll(".form-input");

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    loader.style.display = "block";
    input_forms.forEach(async (input) => {
      lab_results += `,${input.value}`;
      const results = splitTexts(lab_results);

      results.shift();
      let word;
      word = results.join(",");

      try {
        const patient = await axios.put(
          `https://hms-project.herokuapp.com/api/user/${data[0]._id}/lab`,
          { lab_results: word }
        );
        loader.style.display = "none";

        labDetailsBody.style.display = "block";
        lab_form.style.display = "none";
        alert.innerHTML = `<div class='alert-success'>Lab Results Sent</div>`;
        setTimeout(() => {
          alert.style.display = "none";
        }, 5000);
      } catch (err) {
        loader.style.display = "none";
        labDetailsBody.style.display = "block";
        lab_form.style.display = "none";
        alert.innerHTML = `<div class='alert-danger'>${err}</div>`;
        setTimeout(() => {
          alert.style.display = "none";
        }, 5000);
      }
    });
  });
});

const lab_layout = (datum) => {
  let layout;
  layout = ` <div class="card">
          <h3 class="title">Tests To Perform</h3>
          
          <div class="divider-sm"></div>
          
          <div class="payment-details">
            <div class="payment-item">
              <i class="fas fa-user"></i>
              <p class="payment-item-name">${datum.firstname} ${
    datum.lastname
  }</p>
            </div>
            <div class="payment-item" >
              <div>
             
              <p class='payment-item-name'>Tests</p>
              </div>
              <div>
              ${
                datum.consultation.diagnosis.lab_test !== ""
                  ? splitTexts(datum.consultation.diagnosis.lab_tests).map(
                      (test) => {
                        if (test === null || test === "") {
                          return `<p>No Tests Sent</p>`;
                        }

                        return `<p class='test'>${test}</p>`;
                      }
                    )
                  : ""
              }
              
              </div>
             
            </div>

        ${
          datum.consultation.diagnosis.referToLab &&
          Object.keys(datum.consultation.diagnosis).includes("lab_tests")
            ? `<a class='btn' id='proceed_to_tests'>Proceed to tests</a> `
            : ""
        }
        
          </div>
        </div>`;

  return layout;
};
