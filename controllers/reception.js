const electron = require("electron");
const { BrowserWindow, ipcMain } = electron;

const axios = require("axios");

let mainWindow;
let assignDoctorWindow;

const webPreferences = {
  webPreferences: {
    nodeIntegration: true,
  },
};

const receptionController = async (decoded) => {
  mainWindow = new BrowserWindow(webPreferences);
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
};

module.exports = receptionController;
