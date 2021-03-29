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
                <div class="search_output_img">
                  <p class='image'> ${getInitials(
                    patient.firstname,
                    patient.lastname
                  )}</p>
                  <div class="search_output_info">
                  <p class="heading_text">
                  ${patient.firstname} ${patient.lastname}</p>
                 
                  <p class='search_output_date'>Joined Since : ${splitDate(
                    patient.joinedAt,
                    "/"
                  )}</p>
                </div>
                </div>
                
                <i class='fas fa-chevron-right fa-5x assign_btn' id='view_financial_details' data-id=${
                  patient._id
                }></i>
          </div>
        `;
        return temp;
      });
    } else {
      this.output.innerHTML = `
      <div class='error-action'>
          <div >${search_error(
            "User not found",
            "fas fa-user-alt-slash",
            "#c51d1d"
          )}
          </div>
         
      </div>
    `;
    }
  }
}

module.exports = { UI };
