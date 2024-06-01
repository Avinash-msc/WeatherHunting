// variables
const input = document.getElementById("searchbar");
const dropdown = document.getElementById("dropdown");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const currWeatherDiv = document.getElementById("current-weather");
const forecastDiv = document.getElementById("days-forecast");

// recently searched data on local storage
const recentlySearched = JSON.parse(localStorage.getItem("recently_searched")) ?? [];

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
     * @returns {Promise}
     */
    getForecastByLoc: function (lat, lon) {
      return fetchWeather(`forecast/daily?&lat=${lat}&lon=${lon}&days=6`);
    },
    /**
     * Get current weather by city
     * @param {string} city city name
     * @returns {Promise}
     */
    getCurrentWeatherByCity: function (city) {
      return fetchWeather(`current?&city=${city}`);
    },
    /**
     * Get 5 days weather forecast excluding today by city
     * @param {string} city city name
     * @returns {Promise}
     */
    getForecastByCity: function (city) {
      return fetchWeather(`forecast/daily?&city=${city}&days=6`);
    },
  };
})();

/**
 * Shows or hides the loader div between operations 
 * @returns {boolean}
 */
const toggleLoader = () => document.getElementById("loader").classList.toggle("hidden");

/**
 * Updates the recently searched list on local storage
 */
const updateRecentlySearched = () => localStorage.setItem("recently_searched", JSON.stringify(recentlySearched));

/**
 * Enables the buttons & hides the loader
 */
const enableBtns = () => {
  toggleLoader();
  searchBtn.removeAttribute("disabled");
  locationBtn.removeAttribute("disabled");
}

/**
 * Disables the buttons & shows the loader 
 */
const disableBtns = () => {
  searchBtn.setAttribute("disabled", "");
  locationBtn.setAttribute("disabled", "");
  toggleLoader();
}

/**
 * Shows the invalid input information if available
 */
const showValidityMsg = () => {
  if (!input.checkValidity()) {
    input.reportValidity();
  }
};

/**
 * Changes the value of input tag with the text of given element
 * @param {HTMLElement} ele Given dropdown list element
 */
const updateInput = (ele) => {
  input.value = ele.innerText;
  input.focus();
}

/**
 * Updates the dropdown list of recently searched data by given array
 * @param {string[]} arr Given array 
*/
const updateDropdown = (arr = recentlySearched) => {
  dropdown.innerHTML = "";
  for (const i of arr) {
    dropdown.innerHTML += `<div class="drop-item" onclick="updateInput(this)">${i}</div>`;
  }
}

/**
 * It is a case-insensitive search  
 * Returns the true if value is found in the recentlySearched array, or false
 * @param {string} val value to search
 * @returns {boolean}
 */
const findValueInRecentlySearched = (val) => {
  for (let i = 0; i < recentlySearched.length; i++) {
    if (recentlySearched[i].toLowerCase() === val.toLowerCase()) {
      return true;
    }
  }
  return false;
}

/**
 * Creates the new array based on the given val from recentlySearched array
 * @param {string} val value to search
 * @returns {string[]} A new array based on val parameter
 */
const updatedList = (val) => {
  let arr = [];
  for (const i of recentlySearched) {
    if (i.toLowerCase().indexOf(val) > -1) {
      arr.push(i);
    }
  }
  return arr;
}

/**
 * This function is used for
 * - checking the validity of input & showing information accordingly
 * - updating the dropdown items according to the input
 * @returns {string}
 */
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
  updateDropdown(updatedList(val.toLowerCase()));
  showValidityMsg();
  return val.toLowerCase();
}

/**
 * This function is used for Geolocation API to get the coordinates of the location  
 * or appropriate reason for error
 * @returns {Promise}
 */
const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position.coords);
      }, (error) => {
        switch (error) {
          case GeolocationPositionError.PERMISSION_DENIED:
            reject("Location access permisiion denied !!!");
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            reject("Invalid / Unavailable Location !!!");
            break;
          case GeolocationPositionError.TIMEOUT:
            reject("API Timeout : Location not found !!!");
            break;
          default:
            reject(error.message);
        }
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000,
      });
    } else {
      reject("Geolocation API NOT FOUND !!!");
    }
  });
}
