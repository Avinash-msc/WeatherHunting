
/**
 * shows the data on current-weather div
 * @param {object} curr current weather data
 */
function showDataOnCurrDiv(curr) {
  if (curr) {
    if ("error" in curr) {
      currWeatherDiv.innerHTML = `<div class="text-red-700">Current Weather API Error : ${curr.error}</div>`;
    } else {
      const obj = curr.data[0];
      currWeatherDiv.innerHTML = `
      <h2 class="card-title"><i class="fas fa-map-marker-alt"></i> ${obj.city_name}, ${obj.country_code}</h2>
      <h4 class="px-2 font-bold md:text-lg">${new Date(obj.ob_time).toDateString().slice(4)}</h4>
      <div class='card-body'>
        <div>
          <img class='icon' src="https://www.weatherbit.io/static/img/icons/${obj.weather.icon}.png" alt="${obj.weather.description}" />
          <p class="text-center font-bold capitalize text-lg">${obj.weather.description}</p>
        </div>
        <table>
          <tr>
            <td>Temperature</td>
            <td>${obj.temp}&deg;C</td>
          </tr>
          <tr>
            <td>Feels Like</td>
            <td>${obj.app_temp}&deg;C</td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>${obj.rh}%</td>
          </tr>
          <tr>
            <td>Wind</td>
            <td>${obj.wind_spd.toPrecision(2)}m/s</td>
          </tr>
        </table>
      </div>`;
    }
  } else {
    currWeatherDiv.innerHTML = `<div class="text-red-700">Unknown Current Weather API Error !!!</div>`;
  }
}

/**
 * Shows the data on days-forecast div
 * @param {object} forecast 5-days weather forecast data
 */
function showDataOnForecastDiv(forecast) {
  if (forecast) {
    if ("error" in forecast) {
      forecastDiv.innerHTML = `<div class="text-red-700">Forecast API Error: ${forecast.error}</div>`;
    } else {
      const data = forecast.data;
      forecastDiv.innerHTML = `
      <h2 class="card-title">5-Day Forecast</h2>
      <div class="card-body">
        ${(() => {
          let str = '';
          for (let i = 1; i < data.length; i++) {
            str += `
            <div class="forecast-item">
            <h2 class='font-bold text-lg'>${new Date(data[i].datetime).toDateString().slice(4)}</h2>
            <img class='icon' src="https://www.weatherbit.io/static/img/icons/${data[i].weather.icon}.png" alt="${data[i].weather.description}" />
            <h3 class="font-semibold capitalize text-lg mb-2">${data[i].weather.description}</h3>
            <p>
              <span title="Low Temperature"><i class="fas fa-temperature-low"></i> ${data[i].min_temp}&deg;C</span>
              <span title="High Temperature"><i class="fas fa-temperature-high"></i> ${data[i].max_temp}&deg;C</span>
            </p>
            <p>
              <span title='Humidity'>&nbsp;<i class='fas fa-tint'>&deg;</i> ${data[i].rh}% &nbsp;</span>
              <span title='Wind'><i class='fas fa-wind'></i> ${data[i].wind_spd.toPrecision(2)} m/s</span>
            </p>
            </div>`;
          }
          return str;
        })()}
      </div>`;
    }
  } else {
    forecastDiv.innerHTML = `<div class="text-red-700">Unknown Forecast API Error !!!</div>`;
  }
}

/**
 * This function is used for:
 * - Showing the fetched data on divs
 * - Updating the recently searched list on local storage & on dropdown also
 * @param {object} curr current weather data
 * @param {object} forecast weather forecast data
 */
const showAndUpdateData = (curr, forecast) => {
  showDataOnCurrDiv(curr);
  showDataOnForecastDiv(forecast);
  if (forecast) {
    if (input.value === '') {
      input.value = forecast.city_name;
      input.dispatchEvent(new Event("input"));
    }
    const val = input.value.charAt(0).toUpperCase() + input.value.substring(1).toLowerCase();
    if (!findValueInRecentlySearched(val)) {
      recentlySearched.push(val);
      updateRecentlySearched();
      updateDropdown();
    }
  }
}

// Main Functionality
updateDropdown();

//event listeners
input.addEventListener("mousedown", showValidityMsg);
input.addEventListener("focus", inputValidity);
input.addEventListener("input", inputValidity);

searchBtn.addEventListener("click", async function (e) {
  try {
    disableBtns();
    const val = inputValidity();
    if (val) {
      const curr = await weatherModule.getCurrentWeatherByCity(val);
      const forecast = await weatherModule.getForecastByCity(val);
      showAndUpdateData(curr, forecast);
    } else {
      input.focus();
    }
  }
  catch (err) {
    alert(err);
  } finally {
    enableBtns();
  }
});

locationBtn.onclick = async (e) => {
  try {
    disableBtns();
    const loc = await getLocation();
    const curr = await weatherModule.getCurrentWeatherByLoc(loc.latitude, loc.longitude);
    const forecast = await weatherModule.getForecastByLoc(loc.latitude, loc.longitude);
    showAndUpdateData(curr, forecast);
  }
  catch (err) {
    alert(err);
  } finally {
    enableBtns();
  }
};
