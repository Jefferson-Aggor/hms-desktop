const show_and_hide = (
  handler,
  showElem,
  hideElem,
  event = "click",
  ...kwargs
) => {
  if (handler === undefined || handler === null || handler === "") {
    showElem.style.display = "block";
    hideElem.style.display = "none";
  } else {
    handler.addEventListener(event, (e) => {
      e.preventDefault();
      showElem.style.display = "block";
      hideElem.style.display = "none";
      kwargs.forEach((kwarg) => {
        kwarg.style.display = "none";
      });
    });
  }
};

const hide_or_show = (view, ...kwargs) => {
  kwargs.forEach((kwarg) => {
    kwarg.style.display = view;
  });
};
const splitDate = function (date, separator) {
  let dateSplit = date.split("T");
  //  change split format;
  let newFormat = dateSplit[0].split("-");

  return `${newFormat[2]} ${separator} ${newFormat[1]} ${separator} ${newFormat[0]}`;
};

const getInitials = function (firstname, lastname) {
  const splitFirstname = firstname.split("");
  const splitLastname = lastname.split("");

  return `${splitFirstname[0]} ${splitLastname[0]}`;
};

const changeColor = function (placeholder, color) {
  placeholder.firstElementChild.style.color = color;
  placeholder.lastElementChild.style.background = color;
  return placeholder;
};

const showCurrent = function (color = "#fff", ...handlers) {
  handlers.forEach((handler) => {
    handler.addEventListener("click", (e) => {
      e.preventDefault();

      if (handler.id === e.target.id) {
        handler.style.color = color;
      } else {
        handler.style.color = "#f4f4f4";
      }
    });
  });
};

const splitTexts = function (text) {
  const splitTexts = text.split(",");
  return splitTexts;
};
``;

const search_error = function (msg, icon = "far fa-sad-tear", color = "#777") {
  return `<div class='no-user' >
  <i class="${icon} fa-5x" style=color:${color}></i>
  <p style=color:${color}>${msg}</p>
  </div>`;
};

const append_text = function (handler, placeholder, show_num) {
  handler.addEventListener("keyup", (e) => {
    const input_val = e.target.value;
    const splitText = input_val.split(",");
    show_num.innerText = splitText.length;
    placeholder.innerHTML = splitText.map((text) => {
      return `<ul class="patient-details-menu" id="patient-details-menu">
      <li class="patient-details-menu-item">${text}</li> 
    </ul>`;
    });
  });
};

module.exports = {
  show_and_hide,
  splitDate,
  getInitials,
  changeColor,
  splitTexts,
  search_error,
  append_text,
  hide_or_show,
  showCurrent,
};
