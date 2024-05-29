
const input = document.getElementById("searchbar");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const currWeatherDiv = document.getElementById("current-weather");
const forecastDiv = document.getElementById("days-forecast");

/**
 * Weather Module to get weather details from api
 */
const weatherModule = (function () {
  /**
   * @param {string} fetchURL URL to fech data from API
   * @returns {Promise}
   */
  async function fetchWeather(fetchURL) {
    const API_URL = "https://api.weatherbit.io/v2.0";
    const API_KEY = "9e10d460f1904ba0b903816ce43fb6e5";

    try {
      const res = await fetch(`${API_URL}/${fetchURL}&key=${API_KEY}`)
      return res.json();
    } catch (err) {
      console.log('Fetch Error : ', err);
      throw err;
    }

  }
  return {
    /**
     * Get current weather by location coordinates
     * @param {number} lat lattitude of the location
     * @param {number} lon longitude of the location
     * @returns {Promise}
     */
    getCurrentWeatherByLoc: function (lat, lon) {
      return fetchWeather(`current?&lat=${lat}&lon=${lon}`);
    },
    /**
     * Get 5 days weather forecast excluding today by location coordinates
     * @param {number} lat lattitude of the location
     * @param {number} lon longitude of the location
     *  @returns {Promise}
     */
    getForecastByLoc: function (lat, lon) {
      return fetchWeather(`forecast/daily?&lat=${lat}&lon=${lon}&days=6`);
    },
    /**
     * Get current weather by city
     * @param {string} city city name
     *  @returns {Promise}
     *
     */
    getCurrentWeatherByCity: function (city) {
      return fetchWeather(`current?&city=${city}`);
    },
    /**
     * Get 5 days weather forecast excluding today by city
     * @param {string} city city name
     *
     *  @returns {Promise}
     */
    getForecastByCity: function (city) {
      return fetchWeather(`forecast/daily?&city=${city}&days=6`);
    },
  };
})();

/**
 *
 * @param {object} curr
 */
function showDataOnCurrDiv(curr) {
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
      </div>
      `;
  }
}

/**
 * @param {object} forecast
 */
function showDataOnForecastDiv(forecast) {
  if ("error" in forecast) {
    forecastDiv.innerHTML = `<div class="text-red-700">Forecast API Error: ${forecast.error}</div>`
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
            <span title='Wind'><i class='fas fa-wind'></i> ${data[i].wind_spd} m/s</span>
          </p>
          </div>`;
        }
        return str;
      })()}
    </div>`;
  }
}