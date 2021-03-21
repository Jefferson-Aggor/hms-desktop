const electron = require("electron");
const axios = require("axios");

const { ipcRenderer } = electron;

const doctors_placeholder = document.getElementById("doctors-output");
const loader = document.getElementById("loader");
const alert = document.getElementById("alert");

loader.style.display = "block";

ipcRenderer.on("doctors:loaded", (e, data) => {
  loader.style.display = "none";

  doctors_placeholder.innerHTML = data.doctors.map((datum) => {
    return `
   <div class="doctor" id='doctors'  >
   <div class="doctor-image"></div>
   <div class="doctor-content">
     <p class="doctor-content-name" >${datum.firstname} ${datum.lastname}</p>
     <div class="details">
       <div class="sub-details">
         <p>Room No.</p>
         <p class="text-secondary">70</p>
       </div>
       <div class="sub-details">
         <p>Contact</p>
         <a type="tel:${datum.contact}" class="text-secondary">${datum.contact}</a>
       </div>
       <div class="sub-details">
         <p>Email</p>

         <a href="mailto:${datum.email}" class="text-secondary"
           >${datum.email}</a
         >
       </div>
       <a href="" class="btn" id='assign_doctor_btn' data-doctor_id=${datum._id} data-patient_id=${data.patient[0]._id} >Assign Doctor</a>
     </div>
   </div>
 </div>
   `;
  });

  const btns = document.querySelectorAll("#assign_doctor_btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      loader.firstElementChild.innerText = `Assigning Doctor`;
      loader.style.display = "block";
      const doctor_id = e.target.dataset.doctor_id;
      const patient_id = e.target.dataset.patient_id;

      try {
        const assign_doctor = await axios.put(
          `https://hms-project.herokuapp.com/api/user/assign_doctor/${patient_id}`,
          { _id: doctor_id }
        );

        loader.style.display = "none";
        alert.className = `alert-success`;
        alert.innerHTML = `<p>Doctor successfully assigned</p>`;
        setTimeout(() => {
          alert.style.display = "block";
        }, 3000);
      } catch (err) {
        alert.className = `alert-danger`;
        alert.innerHTML = `<p>Failed</p>`;
      }
    });
  });
});
