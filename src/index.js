import {
  getWeatherByCoordinates,
  getCityByCoordinates,
} from './openweathermap';
import showMap from './yamap';
import {
  showWeather,
  showCity,
  makeShowButtonVisible,
  getCityWeather,
  addToHistory,
} from './view';

function findLocation() {
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
    /* eslint-disable-next-line */
    console.error("Can't find coordinates");
  }

  if (!navigator.geolocation) {
    /* eslint-disable-next-line */
    console.error("Geolocation isn't work");
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

window.addEventListener('load', findLocation);
const button = document.getElementById('show');
const input = document.querySelector('#input');
input.addEventListener('change', makeShowButtonVisible);
button.addEventListener('click', getCityWeather);
