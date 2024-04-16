import {getWeatherByCoordinates, getCityByCoordinates, getCoordinatesByCity} from "./openweathermap.js"
import {showMap} from "./yamap.js"
import {showWeather, showCity, makeShowButtonVisible, getCityWeather, addToHistory} from "./view"

function findLocation() {
  if (!navigator.geolocation) {
    console.error("Geolocation isn't work");
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function success(position) {
    // если всё хорошо, собираем ссылку
    const { longitude, latitude } = position.coords;
    getWeatherByCoordinates(latitude, longitude).then((data) => {
      showWeather(
        data.main.temp,
        data.main.temp_min,
        data.main.temp_max,
        data.weather[0].icon,
      );
      showMap(latitude, longitude);
    });
    getCityByCoordinates(latitude, longitude).then((data) => {
      showCity(data[0].name);
      addToHistory(data[0].name, data[0].lat, data[0].lon);
    });
  }

  function error() {
    console.error("Can't find coordinates");
  }
}



window.addEventListener('load', findLocation);
const button = document.getElementById('show');
const input = document.querySelector('#input');
input.addEventListener('change', makeShowButtonVisible);
button.addEventListener('click', getCityWeather);
