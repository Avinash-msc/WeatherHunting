
const showValidityMsg = (event) => {
  if (!event.target.checkValidity()) {
    event.target.reportValidity();
  }
};

function inputValidity() {
  const regex = /^[a-zA-Z]+([\s,][A-Za-z]+)*$/;
  let val = input.value;

  if (val === "") {
    input.setCustomValidity('Enter the City Name');
    val = "";
  } else if (!regex.test(val)) {
    input.setCustomValidity("Only Alphabets & comma allowed !!!");
    val = "";
  } else {
    input.setCustomValidity("");
  }
  input.addEventListener("mousedown", showValidityMsg);
  input.addEventListener("focus", showValidityMsg);
  return val.toLowerCase();
}

searchBtn.addEventListener("click", function (e) {
  searchBtn.setAttribute('disabled', '');
  console.log("Search");
  const val = inputValidity();
  if (val) {
    handleSearchBtn(val);
  } else {
    input.focus();
  }
});

/**
 * @param {string} cityName
 */
async function handleSearchBtn(cityName) {
  try {
    const curr = await weatherModule.getCurrentWeatherByCity(cityName);
    const forecast = await weatherModule.getForecastByCity(cityName);
    console.log(curr)
    console.log(forecast);
    showDataOnCurrDiv(curr);
    showDataOnForecastDiv(forecast);
  } catch (err) {
    alert(err);
  } finally {
    searchBtn.removeAttribute("disabled");
    console.log("Last Stage");
  }
}

/**
 * @param {GeolocationPosition} position
 */
async function handleLocBtn(position) {
  try {
    const curr = await weatherModule.getCurrentWeatherByLoc(position.coords.latitude, position.coords.longitude);
    const forecast = await weatherModule.getForecastByLoc(position.coords.latitude, position.coords.longitude);
    console.log(curr)
    console.log(forecast);
    showDataOnCurrDiv(curr);
    showDataOnForecastDiv(forecast);
    input.value = forecast.city_name;
  } catch (err) {
    alert(err);
  } finally {
    locationBtn.removeAttribute("disabled");
    console.log("Last Stage");
  }
}

locationBtn.onclick = (e) => {
  locationBtn.setAttribute("disabled", "");
  console.log("Location");
  try {
    if (!navigator.geolocation) {
      alert("Geolocation API NOT FOUND !!!");
    }

    navigator.geolocation.getCurrentPosition(handleLocBtn, (err) => {
      if (err === GeolocationPositionError.POSITION_UNAVAILABLE) {
        alert("Invalid / Unavailable Location !!!");
      } else {
        alert(err.message);
      }
    });
  } catch (e) {
    alert(e.message);
  }
};

function showErrorOnSection(info) {
  console.log(info);
  const weatherReportSec = document.getElementById("weather-report");
  weatherReportSec.innerHTML += `
    <div class="w-full error" id="process-info">
    ${info}
    </div>
    `;
}
