const axios = require("axios");
const electron = require("electron");
const { changeColor, splitTexts } = require("../../helpers/helpers");
const { ipcRenderer } = electron;

const financial_details = document.querySelector(".financial-details-body");
const progress_1 = document.querySelector("#progress-1");
const progress_2 = document.querySelector("#progress-2");
const progress_3 = document.querySelector("#progress-3");
const loader = document.getElementById("loader");

let registration = 90;
let lab_test = 30;
let drugs = 80;

ipcRenderer.on("financial:details", (e, data) => {
  console.log(data[0]);
  financial_details.innerHTML = data.map((datum) => {
    const { paid, consultation, lab_results, paidForDrugs } = datum;
    if (!paid) {
      return registration_payment(datum);
    }

    if (paid && consultation.diagnosis.referToLab && !lab_results.paidForLab) {
      return lab_payment(datum);
    }

    if (paid && lab_results.paidForLab && !paidForDrugs) {
      return drugs_payment(datum);
    }

    return completePayment(datum);
  });
  const btn = document.querySelector(".btn");

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (e.target.id === "registration") {
      try {
        loader.style.display = "block";
        const patient = await axios.put(
          `https://hms-project.herokuapp.com/api/payment/${data[0]._id}`,
          { paid: "yes" }
        );
        loader.style.display = "none";
        changeColor(progress_1, "green");
        financial_details.innerHTML = `
        <div class='success-window'>
          <div class='success-body card'>
            
            <div class='success-body-details'>
              <div style='display:flex;justify-content:space-between;margin-bottom:2rem'>
                <p class="title" style='color:green;font-weight: 600'>Registration Payment Complete</p>
                <i class="fas fa-check fa-2x" style='color:green'></i>
              </div>
              <div class="payment-item">
                <i class="fas fa-user"></i>
                <p class="payment-item-name">${data[0].firstname} ${data[0].lastname}</p>
              </div>
              <div class="payment-item">
              <p class="payment-item-name">TOTAL AMOUNT PAID</p>
              <p class="payment-item-name">${registration}</p>
                
              </div>
            </div>
            <a class="btn" ><i class='fas fa-chevron-left'></i> Back</a>
          </div>
        </div>
        `;

        document.querySelector(".btn").addEventListener("click", (e) => {
          e.preventDefault();
          console.log("back");
          ipcRenderer.send("financial:back", true);
        });
        console.log(patient.data.data);
      } catch (err) {
        console.log(err);
      }
    }

    if (e.target.id === "lab_payment") {
      try {
        loader.style.display = "block";
        const patient = await axios.put(
          `https://hms-project.herokuapp.com/api/payment/lab/${data[0]._id}`,
          { paid: "yes" }
        );
        loader.style.display = "none";
        changeColor(progress_2, "green");
        financial_details.innerHTML = `
        <div class='success-window'>
          <div class='success-body card'>
            
            <div class='success-body-details'>
              <div style='display:flex;justify-content:space-between;margin-bottom:2rem'>
                <p class="title" style='color:green;font-weight: 600'>Lab Payment Complete</p>
                <i class="fas fa-check fa-2x" style='color:green'></i>
              </div>
              <div class="payment-item">
                <i class="fas fa-user"></i>
                <p class="payment-item-name">${data[0].firstname} ${data[0].lastname}</p>
              </div>
              <div class="payment-item">
              <p class="payment-item-name">TOTAL AMOUNT PAID</p>
              <p class="payment-item-name">${lab_test}</p>
                
              </div>
            </div>
            <a class="btn" ><i class='fas fa-chevron-left'></i> Back</a>
          </div>
        </div>
        `;
        document.querySelector(".btn").addEventListener("click", (e) => {
          e.preventDefault();
          console.log("back");
          ipcRenderer.send("financial:back", true);
        });
        console.log(patient.data.data);
      } catch (err) {
        console.log(err);
      }
    }

    if (e.target.id === "drugs_payment") {
      try {
        loader.style.display = "block";
        const patient = await axios.put(
          `https://hms-project.herokuapp.com/api/payment/drugs/${data[0]._id}`,
          { paid: "yes" }
        );
        loader.style.display = "none";
        changeColor(progress_3, "green");
        financial_details.innerHTML = `
        <div class='success-window'>
          <div class='success-body card'>
            
            <div class='success-body-details'>
              <div style='display:flex;justify-content:space-between;margin-bottom:2rem'>
                <p class="title" style='color:green;font-weight: 600'>Drugs Payment Complete</p>
                <i class="fas fa-check fa-2x" style='color:green'></i>
              </div>
              <div class="payment-item">
                <i class="fas fa-user"></i>
                <p class="payment-item-name">${data[0].firstname} ${data[0].lastname}</p>
              </div>
              <div class="payment-item">
              <p class="payment-item-name">TOTAL AMOUNT PAID</p>
              <p class="payment-item-name">${drugs}</p>
                
              </div>
            </div>
            <a class="btn" ><i class='fas fa-chevron-left'></i> Back</a>
          </div>
        </div>
        `;

        document.querySelector(".btn").addEventListener("click", (e) => {
          e.preventDefault();
          console.log("back");
          ipcRenderer.send("financial:back", true);
        });

        console.log(patient.data.data);
      } catch (err) {
        console.log(err);
      }
    }

    if (e.target.id === "close") {
      document.querySelector(".btn").addEventListener("click", (e) => {
        e.preventDefault();
        console.log("back");
        ipcRenderer.send("financial:back", true);
      });
    }
  });
});

const registration_payment = (datum) => {
  changeColor(progress_1, "#00afb9");
  let layout;
  layout = ` <div class="card">
    <h3 class="title">Registration Payment</h3>
    <div class="divider-sm"></div>
    <div class="payment-details">
      <div class="payment-item">
        <i class="fas fa-user"></i>
        <p class="payment-item-name">${datum.firstname} ${datum.lastname}</p>
      </div>
      <div class="payment-item">
        <i class="fas fa-map-marker-alt"></i>
        <p class="payment-item-name">${datum.area_of_residence}</p>
      </div>
      <div class="payment-item">
        <i class="fas fa-phone"></i>
        <p class="payment-item-name">${datum.contact}</p>
      </div>
      <div class="payment-item">
      <i class="fas fa-money-bill-wave"></i>
        <p class="payment-item-name">ghs ${registration}</p>
      </div>


    </div>
    <a class="btn" id='registration'>Pay</a>
  </div>`;

  return layout;
};

const lab_payment = (datum) => {
  changeColor(progress_1, "#00afb9");
  changeColor(progress_2, "#00afb9");
  let layout;
  layout = ` <div class="card">
      <h3 class="title">Laboratory Payment</h3>
      <div class="divider-sm"></div>
      <div class="payment-details">
        <div class="payment-item">
          <i class="fas fa-user"></i>
          <p class="payment-item-name">${datum.firstname} ${datum.lastname}</p>
        </div>
        <div class="payment-item" >
          <p style=color:#00afb9> Tests </p>
          <div>
          ${splitTexts(datum.consultation.diagnosis.lab_tests).map((test) => {
            console.log(test);
            return `<p>${test}</p>`;
          })}
          </div>
        </div>
        <div class="payment-item">
        <i class="fas fa-currency"></i>
        <p class="payment-item-name">ghs ${lab_test}</p>
      </div>
      </div>
      <a href='' class="btn" id='lab_payment'>Pay</a>
    </div>`;
};

const drugs_payment = (datum) => {
  changeColor(progress_3, "#00afb9");
  let layout;
  layout = ` <div class="card">
        <h3 class="title">Drugs Payment</h3>
        <div class="divider-sm"></div>
        <div class="payment-details">
          <div class="payment-item">
            <i class="fas fa-user"></i>
            <p class="payment-item-name">${datum.firstname} ${
    datum.lastname
  }</p>
          </div>
          <div class="payment-item" >
            <i class='fas fa-prescription-bottle-alt'></i>
            <div>
            ${
              datum.consultation.diagnosis.prescription
                ? splitTexts(
                    datum.consultation.diagnosis.prescriptions !== null
                      ? datum.consultation.diagnosis.prescriptions
                      : ""
                  ).map((test) => {
                    if (test === null) {
                      return `<p>No prescriptions yet</p>`;
                    }
                    console.log(test);
                    return `<p>${test}</p>`;
                  })
                : null
            }
            </div>
          </div>
          <div class="payment-item">
         <i class="fas fa-money-bill-wave"></i>
          <p class="payment-item-name">ghs ${drugs}</p>
        </div>
        </div>
        <a href='' class="btn" id='drugs_payment'>Pay</a>
      </div>`;

  return layout;
};

const completePayment = (datum) => {
  changeColor(progress_1, "#00afb9");
  changeColor(progress_2, "#00afb9");
  changeColor(progress_3, "#00afb9");

  let amount;
  if (datum.paid && !datum.paidForLab && !datum.paidForDrugs) {
    amount = registration;
  } else if (datum.paid && datum.paidForLab && !datum.paidForDrugs) {
    amount += lab_test;
  } else if (datum.paid && datum.paidForLab && datum.paidForDrugs) {
    console.log(amount);
    amount += drugs;
  }

  let layout;
  layout = ` <div class="card">
    <h3 class="title">Complete Checkout</h3>
    <div class="divider-sm"></div>
    <div class="payment-details">
      <div class="payment-item">
        <p class="payment-item-name">REGISTRATION</p>
        <i class="fas fa-check"></i>
      </div>
      ${
        datum.paid &&
        datum.consultation.diagnosis.referToLab &&
        datum.lab_results.paidForLab
          ? `<div class="payment-item">
            <p class="payment-item-name">LABORATORY</p>
            <i class="fas fa-check"></i>
          </div>`
          : ""
      }

      ${
        datum.paid &&
        Object.keys(datum.consultation.diagnosis).includes("presciptions") &&
        datum.consultation.diagnosis.prescriptions !== null &&
        datum.paidForDrugs
          ? `<div class="payment-item">
            <p class="payment-item-name">DRUGS</p>
            <i class="fas fa-check"></i>
          </div>`
          : ""
      }
 
      <div class="payment-item">
      <p class="payment-item-name">TOTAL COST</p>
      <p class="payment-item-name amount">${amount}</p>
      
        </div>
    </div>
    <a class="btn" id='close'>Close</a>
  </div>`;

  // document.querySelector(".btn").addEventListener("click", (e) => {
  //   e.preventDefault();
  //   console.log("clicked");
  // });

  return layout;
};

const calcCost = function (datum) {
  let amount;
  if (datum.paid && !datum.paidForLab && !datum.paidForDrugs) {
    return (amount = registration);
  }
  if (datum.paid && datum.paidForLab && !datum.paidForDrugs) {
    return (amount = registration + lab_test);
  }
  if (datum.paid && datum.paidForLab && datum.paidForDrugs) {
    return (amount = registration + lab_test + drugs);
  }
};

// const goBack = function(btn){
//   btn.addEventListener('click', e =>{
//     e.preventDefault()
//     ipcRenderer('goBack',true)
//   })
// }
