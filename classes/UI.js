const { splitDate, getInitials, search_error } = require("../helpers/helpers");
class UI {
  constructor() {
    this.output = document.getElementById("search_output");
  }

  showSearchedUsers(patients) {
    if (patients.length > 0) {
      this.output.innerHTML = patients.map((patient) => {
        const temp = `
        <div class="card" >
                  <div class=" search_output_img">
                    <p> ${getInitials(patient.firstname, patient.lastname)}</p>
                  </div>
                  <div class="search_output_info">
                    <p class="heading_text">
                    ${patient.firstname} ${patient.lastname}</p>
                    <div class="divider-sm"></div>
                    <p>${splitDate(patient.joinedAt, "-")}</p>
                  </div>
                  <a href="" class="btn" id='view_financial_details' data-id=${
                    patient._id
                  } >View Records</a>
                </div>
        `;
        return temp;
      });
    } else {
      this.output.innerHTML = search_error("User not found");
    }
  }
}

module.exports = { UI };
