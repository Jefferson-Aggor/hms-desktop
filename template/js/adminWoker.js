const electron = require("electron");
const { ipcRenderer } = electron;

const profile = document.querySelector(".profile");

ipcRenderer.on("admin:worker-details", (e, data) => {
  profile.innerHTML = `
 <div class="profile-body">
        <div class="profile-body-image">
          <img src="../assets/imgs/img_avtar.jpg" alt="profile-img" />
        </div>
        <div class="profile-body-content">
          <div class="profile-header">
            <div>
              <h3 class="profile-name">${data.firstname} ${data.lastname}</h3>
              <p class="role"><i class="fas fa-thumbtack"></i> ${data.role}</p>
            </div>

            
            <p><i class="fas fa-map-marker-alt"></i> ${data.area_of_residence}</p>
          </div>
          <div class="profile-btns">
            <a href="" class="profile-btn" id='edit-btn'
              ><i class="fas fa-user-edit"></i> Edit</a
            >
            <a href="" class="profile-btn" id='delete-btn'
              ><i class="far fa-trash-alt"></i> Delete</a
            >
            <a href="" class="profile-btn"
              ><i class="fas fa-chevron-right"></i
            ></a>
          </div>

          <div class="profile-contents">
            <div style="margin-bottom: 5rem">
              <h3 class="profile-title">About</h3>
              <div class="profile-divider-sm"></div>
            </div>

            <div class="profile-about">
              <div class="profile-about-item">
                <p class="profile-about-item-name">Contact</p>
                <p class="profile-about-item-value">${data.contact}</p>
              </div>
              <div class="profile-about-item">
                <p class="profile-about-item-name">
                  <i class="fas fa-envelope"></i> Email
                </p>
                <p class="profile-about-item-value">${data.email}</p>
              </div>
              <div class="profile-about-item">
                <p class="profile-about-item-name">
                  <i class="fas fa-phone"></i> Emergency Contact
                </p>
                <p class="profile-about-item-value">${data.emergency_contact}</p>
              </div>
              <div class="profile-about-item">
                <p class="profile-about-item-name">
                  <i class="fas fa-map-marker-alt"></i> Location
                </p>
                <p class="profile-about-item-value">${data.area_of_residence}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
 `;
});
