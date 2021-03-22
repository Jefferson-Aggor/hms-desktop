const electron = require("electron");
const jwt_decode = require("jwt-decode");
const axios = require("axios");

const { app, Menu, BrowserWindow, ipcMain } = electron;

const receptionController = require("./controllers/reception");

let loginWindow;
let mainWindow;
let financeWindow;
let consultationWindow;
let assignDoctorWindow;
let financialDetailsWindow;
let consultationDetailsWindow;
let labWindow;
let labDetailsWindow;
let adminWindow;
let workerWindowDetails;
let patientWindowDetails;
let pharmacyWindow;
let pharmacyDetailsWindow;

const webPreferences = {
  webPreferences: {
    nodeIntegration: true,
  },
};

app.on("ready", () => {
  loginWindow = new BrowserWindow({
    ...webPreferences,
    resizable: false,
    autoHideMenuBar: true,
    // kiosk: true,
  });
  // Load HTML in app

  loginWindow.loadURL(`file://${__dirname}/template/pages/auth.html`);

  ipcMain.on("login:token", (e, data) => {
    loginWindow.hide();
    const decoded = jwt_decode(data);

    switch (decoded.role) {
      case "receptionist":
        mainWindow = new BrowserWindow({ ...webPreferences, kiosk: true });
        mainWindow.maximize();
        mainWindow.loadURL(`file://${__dirname}/template/pages/index.html`);
        mainWindow.webContents.on("did-finish-load", function () {
          mainWindow.webContents.send("loggedUserDetails", decoded);
          ipcMain.on("patient", async function (e, data) {
            try {
              const patient = fetchPatient(data);

              if (!patient) console.log("error");

              mainWindow.webContents.send("patient:loaded", true);

              assignDoctorWindow = new BrowserWindow({
                ...webPreferences,
                width: 650,
                height: 650,
                resizable: false,
                alwaysOnTop: true,
              });

              assignDoctorWindow.loadURL(
                `file://${__dirname}/template/pages/assign-doctor.html`
              );

              assignDoctorWindow.webContents.on("did-finish-load", async () => {
                try {
                  const doctors = await axios.get(
                    `https://hms-project.herokuapp.com/api/workers/?role=doctor`
                  );

                  if (!doctors) console.log("no doctors");

                  assignDoctorWindow.webContents.send("doctors:loaded", {
                    doctors: doctors.data.data,
                    patient: patient.data.data,
                  });
                } catch (err) {
                  console.log(err);
                }
              });
            } catch (err) {
              console.log(err.message);
            }
          });
        });
        break;

      case "cashier":
        financeWindow = new BrowserWindow(webPreferences);
        financeWindow.maximize();
        financeWindow.loadURL(
          `file://${__dirname}/template/pages/finance.html`
        );
        financeWindow.webContents.on("did-finish-load", function () {
          financeWindow.webContents.send("loggedUserDetails", decoded);

          ipcMain.on("financial:view_details", async (e, data) => {
            const patient = await axios.get(
              `https://hms-project.herokuapp.com/api/members/?_id=${data}`
            );

            if (!patient) console.log("error");

            financeWindow.webContents.send("loadedPatient", true);

            financialDetailsWindow = new BrowserWindow({
              ...webPreferences,
              width: 700,
              height: 700,
              resizable: false,
              alwaysOnTop: true,
            });
            financialDetailsWindow.loadURL(
              `file://${__dirname}/template/pages/financial_details.html`
            );

            financialDetailsWindow.webContents.on(
              "did-finish-load",
              async () => {
                try {
                  financialDetailsWindow.webContents.send(
                    "financial:details",
                    patient.data.data
                  );
                } catch (err) {
                  console.log(err);
                }
              }
            );

            financialDetailsWindow.on("close", async () => {
              financialDetailsWindow = null;
            });
          });
        });
        break;

      case "doctor":
        consultationWindow = new BrowserWindow({
          ...webPreferences,
          // kiosk: true,
        });
        consultationWindow.maximize();
        consultationWindow.loadURL(
          `file://${__dirname}/template/pages/consultation.html`
        );

        consultationWindow.webContents.on("did-finish-load", async () => {
          consultationWindow.webContents.send("loggedUserDetails", decoded);

          ipcMain.on("consultation:patient", async (e, data) => {
            const patient = await axios.get(
              `https://hms-project.herokuapp.com/api/members/?_id=${data}`
            );

            if (!patient) console.log("error");

            consultationWindow.webContents.send("patient:loaded", true);

            consultationDetailsWindow = new BrowserWindow({
              ...webPreferences,
              height: 700,
              width: 700,
            });
            consultationDetailsWindow.loadURL(
              `file://${__dirname}/template/pages/consultationDetailsWindow.html`
            );

            consultationDetailsWindow.webContents.on(
              "did-finish-load",
              async () => {
                try {
                  consultationDetailsWindow.webContents.send(
                    "consultation:details",
                    patient.data.data
                  );
                } catch (err) {
                  console.log(err);
                }
              }
            );
          });
        });
        break;

      case "lab technician":
        labWindow = new BrowserWindow({
          ...webPreferences,
          // kiosk: true,
        });
        labWindow.maximize();
        labWindow.loadURL(`file://${__dirname}/template/pages/lab.html`);

        labWindow.webContents.on("did-finish-load", async () => {
          labWindow.webContents.send("loggedUserDetails", decoded);

          ipcMain.on("lab:patient", async (e, data) => {
            const patient = await axios.get(
              `https://hms-project.herokuapp.com/api/members/?_id=${data}`
            );

            if (!patient) console.log("error");

            labWindow.webContents.send("patient:loaded", true);

            labDetailsWindow = new BrowserWindow({
              ...webPreferences,
              height: 700,
              width: 700,
            });
            labDetailsWindow.loadURL(
              `file://${__dirname}/template/pages/labDetailsWindow.html`
            );

            labDetailsWindow.webContents.on("did-finish-load", async () => {
              try {
                labDetailsWindow.webContents.send(
                  "lab:details",
                  patient.data.data
                );
              } catch (err) {
                console.log(err);
              }
            });
          });
        });

        break;

      case "admin":
        adminWindow = new BrowserWindow({ ...webPreferences });
        adminWindow.maximize();
        adminWindow.loadURL(`file://${__dirname}/template/pages/admin.html`);

        adminWindow.webContents.on("did-finish-load", async () => {
          adminWindow.webContents.send("loggedUserDetails", decoded);
        });

        ipcMain.on("admin:view-worker", async (e, data) => {
          try {
            const worker = await axios.get(
              `https://hms-project.herokuapp.com/api/workers/${data}`
            );

            if (worker) {
              workerWindowDetails = new BrowserWindow({
                ...webPreferences,
                height: 700,
                width: 700,
              });
              adminWindow.webContents.send("client:loaded", true);
              workerWindowDetails.loadURL(
                `file://${__dirname}/template/pages/adminWorkerDetails.html`
              );

              workerWindowDetails.webContents.on(
                "did-finish-load",
                async () => {
                  workerWindowDetails.webContents.send(
                    "admin:worker-details",
                    worker.data.data
                  );
                }
              );
            } else {
              console.log("worker not found");
            }
          } catch (err) {
            console.log(err);
          }
        });

        ipcMain.on("admin:patient-details", async (e, data) => {
          try {
            const patients = await axios.get(
              `https://hms-project.herokuapp.com/api/members/?_id=${data}`
            );

            console.log(patients);

            if (patients) {
              patientWindowDetails = new BrowserWindow({
                ...webPreferences,
                height: 700,
                width: 700,
              });

              adminWindow.webContents.send("client:loaded", true);
              patientWindowDetails.loadURL(
                `file://${__dirname}/template/pages/adminPatientDetails.html`
              );

              patientWindowDetails.webContents.on(
                "did-finish-load",
                async () => {
                  patientWindowDetails.webContents.send(
                    "admin:patient-details",
                    patients.data.data
                  );
                }
              );
            }
          } catch (err) {}
        });
        break;

      case "pharmacist":
        pharmacyWindow = new BrowserWindow({ ...webPreferences });
        pharmacyWindow.maximize();
        pharmacyWindow.loadURL(
          `file://${__dirname}/template/pages/pharmacist.html`
        );

        pharmacyWindow.webContents.on("did-finish-load", async () => {
          pharmacyWindow.webContents.send("loaggedUserDetails", decoded);
        });

        ipcMain.on("pharmacy:patient", async (e, data) => {
          try {
            const patient = await axios.get(
              `https://hms-project.herokuapp.com/api/members/?_id=${data}`
            );

            if (patient) {
              pharmacyDetailsWindow = new BrowserWindow({
                ...webPreferences,
                height: 700,
                width: 700,
              });
              pharmacyWindow.webContents.send("patient:loaded", true);
              pharmacyDetailsWindow.loadURL(
                `file://${__dirname}/template/pages/pharmacyDetailsWindow.html`
              );

              pharmacyDetailsWindow.webContents.on("did-finish-load", () => {
                pharmacyDetailsWindow.webContents.send(
                  "pharmacy:patient-details",
                  patient.data.data
                );
              });
            } else {
              console.log("patient not found");
            }
          } catch (err) {
            console.log(err);
          }
        });

        break;
      default:
        loginWindow.loadURL(`file://${__dirname}/template/pages/auth.html`);
    }
  });
});

const fetchPatient = async (data) => {
  const patient = await axios.get(
    `https://hms-project.herokuapp.com/api/members/?_id=${data}`
  );

  return patient;
};
