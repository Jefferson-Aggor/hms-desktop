const axios = require("axios");
const electron = require("electron");
const { ipcRenderer } = electron;
const { splitDate } = require("../../helpers/helpers");
const profile = document.querySelector(".profile");
const loader = document.getElementById("loader");

ipcRenderer.on("admin:patient-details", async (e, data) => {
  profile.innerHTML = `
 <div class="profile-body">
        <div class="profile-body-image">
          <img src="../assets/imgs/img_avtar.jpg" alt="profile-img" />
        </div>
        <div class="profile-body-content">
          <div class="profile-header">
            <div>
              <h3 class="profile-name">${data[0].firstname} ${
    data[0].lastname
  }</h3>
  <p class="role"><i class="fas fa-handshake"></i> ${splitDate(
    data[0].joinedAt,
    " "
  )}</p>
            </div>

            ${
              data[0].paid
                ? `
            <p style="color:green;">
                <i class="fas fa-check"></i>
            </p>`
                : `<p style="color:red;">
                <i class="fas fa-cross"></i>
            </p>`
            }
          </div>
          

          <div class="profile-contents">
            <div style="margin-bottom: 5rem">
              <h3 class="profile-title">About</h3>
              <div class="profile-divider-sm"></div>
            </div>

            <div class="profile-about">
              <div class="profile-about-item">
                <p class="profile-about-item-name">Contact</p>
                <p class="profile-about-item-value">${data[0].contact}</p>
              </div>
              <div class="profile-about-item">
                <p class="profile-about-item-name">
                  <i class="fas fa-clock"></i> Date of birth
                </p>
                <p class="profile-about-item-value">${data[0].date_of_birth}</p>
              </div>
              <div class="profile-about-item">
                <p class="profile-about-item-name">
                  <i class="fas fa-phone"></i> Emergency Contact
                </p>
                <p class="profile-about-item-value">${
                  data[0].emergencyContact
                }</p>
              </div>
              <div class="profile-about-item" style="margin-bottom: 2rem">
                <p class="profile-about-item-name">
                  <i class="fas fa-map-marker-alt"></i> Location
                </p>
                <p class="profile-about-item-value">${
                  data[0].area_of_residence
                }</p>
              </div>
            </div>
          </div>
          
      </div>
 `;
});
