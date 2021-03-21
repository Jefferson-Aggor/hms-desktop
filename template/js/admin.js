const electron = require("electron");
const axios = require("axios");

const { ipcRenderer } = electron;
const {
  hide_or_show,
  show_and_hide,
  showCurrent,
  search_error,
  splitDate,
} = require("../../helpers/helpers");

const username = document.getElementById("username");
const register_form = document.getElementById("register_form");
const loader = document.getElementById("loader");
const filter = document.getElementById("filter");
const patient_output = document.getElementById("patient-output");
const alert = document.querySelector(".alert");

// icons
const overview_icon = document.getElementById("overview-icon");
const register_icon = document.getElementById("register-icon");
const workers_icon = document.getElementById("workers-icon");
const patients_icon = document.getElementById("patients-icon");
const logout_icon = document.getElementById("logout-icon");

// bodies
const overview = document.getElementById("overview");
const register = document.getElementById("register-worker");
const worker_details = document.getElementById("get-workers-details");
const patient_details = document.getElementById("get-patients-details");
const output = document.getElementById("output");

// overview;
const num_patients = document.getElementById("num-patients");
const num_workers = document.getElementById("num-workers");

//hide or show
register.style.display = "none";
hide_or_show("none", register, worker_details, patient_details);

ipcRenderer.on("loggedUserDetails", (e, data) => {
  username.innerText = `${data.firstname} ${data.lastname}`;
});

// show loader
loader.style.display = "block";

ipcRenderer.on("client:loaded", (e, data) => {
  if (data) {
    loader.style.display = "none";
  }
});
//show current;
showCurrent("#fff", overview_icon, patients_icon, register_icon, workers_icon);

// show register
show_and_hide(
  overview_icon,
  overview,
  register,
  "click",
  worker_details,
  patient_details
);

// show register
show_and_hide(
  register_icon,
  register,
  overview,
  "click",
  worker_details,
  patient_details
);

// show all workers
show_and_hide(
  workers_icon,
  worker_details,
  overview,
  "click",
  register,
  patient_details
);

// show all patients
show_and_hide(
  patients_icon,
  patient_details,
  overview,
  "click",
  register,
  worker_details
);

// search for workers and patients;
const searchPatients = async () => {
  try {
    const patients = await axios.get(
      "https://hms-project.herokuapp.com/api/members/"
    );

    const workers = await axios.get(
      "https://hms-project.herokuapp.com/api/workers/"
    );
    return {
      patients: patients.data,
      workers: workers.data,
    };
  } catch (err) {
    return { err };
  }
};

// Get Number of patients and workers : Overview
searchPatients()
  .then((data) => {
    if (data.err) {
      loader.style.display = "none";
      overview.innerHTML = search_error(data.err);
    } else {
      loader.style.display = "none";
      num_patients.innerText = data.patients.count;
      num_workers.innerText = data.workers.count;
    }
  })
  .catch((err) => {
    console.log(err);
  });

//   activate search when clicked
workers_icon.addEventListener("click", (e) => {
  e.preventDefault();
  loader.firstElementChild.innerText = "Fetching Workers.";
  loader.style.display = "block";

  searchPatients().then((data) => {
    if (data.err) {
      loader.style.display = "none";
      output.innerHTML = search_error(data.err);
    } else {
      loader.style.display = "none";
      let workers = data.workers.data;

      output.innerHTML = workers.map((worker) => {
        return `<div class="worker-details">
                <div class="worker-image"></div>
                <div class="worker-info">
                  <h1 class="title" style='text-transform:capitalize'>${worker.firstname} ${worker.lastname}</h1>
                  <div class="info">
                    <p class="info-heading">Role</p>
                    <p class="info-sub-text">${worker.role}</p>
                  </div>
                  <div class="info">
                    <p class="info-heading">Contact</p>
                    <p class="info-sub-text">${worker.contact}</p>
                  </div>
                  <a href="" class="btn" style="text-align: center;" data-id = ${worker._id}>View More</a>
                </div>
              </div>`;
      });

      const btns = document.querySelectorAll(".btn");
      btns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          loader.firstElementChild.innerText = "Loading...";
          loader.style.display = "block";
          ipcRenderer.send("admin:view-worker", e.target.dataset.id);
        });
      });
    }
  });
});

//   filter search;
filter.addEventListener("change", async (e) => {
  let filterOptions;
  filterOptions = e.target.value;
  loader.firstElementChild.innerText = `Fetching ${filterOptions}(s) `;
  loader.style.display = "block";

  try {
    const workers = await axios.get(
      `https://hms-project.herokuapp.com/api/workers/?role=${filterOptions}`
    );

    loader.style.display = "none";
    if (workers.data.count === 0) {
      output.innerHTML = search_error(
        `No ${filterOptions} found`,
        "fas fa-exclamation-triangle"
      );
    } else {
      output.innerHTML = workers.data.data.map((worker) => {
        return `<div class="worker-details">
          <div class="worker-image"></div>
          <div class="worker-info">
            <h1 class="title">${worker.firstname} ${worker.lastname}</h1>
            <div class="info">
              <p class="info-heading">Role</p>
              <p class="info-sub-text">${worker.role}</p>
            </div>
            <div class="info">
              <p class="info-heading">Contact</p>
              <p class="info-sub-text">${worker.contact}</p>
            </div>
            <a href="" class="btn" style="text-align: center;" data-id=${worker._id}>View More</a>
          </div>
        </div>`;
      });
    }

    const btns = document.querySelectorAll(".btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        loader.firstElementChild.innerText = "Loading...";
        loader.style.display = "block";
        ipcRenderer.send("admin:view-worker", e.target.dataset.id);
      });
    });
  } catch (err) {
    loader.style.display = "none";
    output.innerHTML = search_error(err);
  }
});

patients_icon.addEventListener("click", (e) => {
  e.preventDefault();
  loader.firstElementChild.innerText = "Fetching Patients.";
  loader.style.display = "block";

  searchPatients().then((data) => {
    if (data.err) {
      loader.style.display = "none";
      patient_output.innerHTML = search_error(data.err);
    } else {
      loader.style.display = "none";
      patient_output.innerHTML = data.patients.data.map((patient) => {
        return `
        <div class="worker-details">
          <div class="worker-image"></div>
          <div class="worker-info">
            <h1 class="title">${patient.firstname} ${patient.lastname}</h1>
            <div class="info">
              <p class="info-heading">Registered At</p>
              <p class="info-sub-text">${splitDate(patient.joinedAt, "/")}</p>
            </div>
            <div class="info">
              <p class="info-heading">Contact</p>
              <p class="info-sub-text">${patient.contact}</p>
            </div>
            <a href="" class="btn" style="text-align: center;" data-id=${
              patient._id
            }>View More</a>
          </div>
        </div>`;
      });
      const btns = document.querySelectorAll(".btn");
      btns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          loader.firstElementChild.innerText = "Loading...";
          loader.style.display = "block";
          ipcRenderer.send("admin:patient-details", e.target.dataset.id);
        });
      });
    }
  });
});

//Registration form;

register_form.addEventListener("submit", register_worker);

async function register_worker(e) {
  e.preventDefault();

  const alert_text = document.querySelector(".alert-text");
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const area_of_residence = document.getElementById("location").value;
  const contact = document.getElementById("contact").value;
  const emergency_contact = document.getElementById("emergencyContact").value;
  const role = document.getElementById("role");
  const marital_status = document.getElementById("marital_status").value;
  const password = document.getElementById("password");
  const password2 = document.getElementById("password2");
  const date_of_birth = document.getElementById("dob").value;

  if (password.value.length < 6) {
    alert_text.innerHTML = `<p>Password must be more than 6 chars</p>`;
    setTimeout(() => {
      alert_text.innerHTML = "";
    }, 3000);
  } else if (password.value !== password2.value) {
    alert_text.innerHTML = `<p>Passwords do not match</p>`;
    setTimeout(() => {
      alert_text.innerHTML = "";
    }, 3000);
  } else {
    loader.style.display = "block";

    const workerData = {
      firstname,
      lastname,
      email,
      area_of_residence,
      contact,
      emergency_contact,
      role: role.value,
      marital_status,
      password: password.value,
      date_of_birth,
    };

    try {
      console.log(workerData);
      const worker = await axios.post(
        `https://hms-project.herokuapp.com/api/workers/register/`,
        workerData
      );

      alert.innerHTML = `<div class='alert-success'>Successfully Registered A Worker</div>`;

      console.log(worker.data);
      loader.style.display = "none";
      setTimeout(() => {
        alert.innerHTML = "";
      }, 5000);
    } catch (err) {
      console.log(err);
      loader.style.display = "none";
      alert.innerHTML = `<div class='alert-danger'>Failed Register A Worker. \n ${err}</div>`;
      setTimeout(() => {
        alert.innerHTML = "";
      }, 5000);
    }
  }
}

// Logout;
logout_icon.addEventListener("click", (e) => {
  if (confirm("Are you sure you want to log out?")) {
    console.log(true);
  } else {
    console.log(false);
  }
});
