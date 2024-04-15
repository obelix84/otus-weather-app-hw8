import {getWeatherByCoordinates, getCityByCoordinates, getCoordinatesByCity} from "./openweathermap.js"
import {showMap} from "./yamap.js"
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

function addToHistory(city, lat, lon) {
  const history = document.getElementById('history');
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item');
  const a = document.createElement('a');
  a.href = '#';
  a.innerText = city;
  a.setAttribute('data-lat', lat);
  a.setAttribute('data-lon', lon);
  a.onclick = getWeatherFromHistory;
  li.append(a);
  history.append(li);
  const list = history.querySelectorAll('li.list-group-item:not(li.active)');
  if (list.length > 5) history.removeChild(list[0]);
}

function showCity(city) {
  const cityHeader = document.getElementById('city');
  cityHeader.innerText = city;
}
function showWeather(current, min, max, icon) {
  const weatherField = document.getElementById('weather');
  const oldPar = weatherField.querySelector('p');
  weatherField.removeChild(oldPar);
  const oldImg = weatherField.querySelector('img');
  if (oldImg) weatherField.removeChild(oldImg);
  const img = document.createElement('img');
  img.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  const p = document.createElement('p');
  p.innerHTML = `Current: <b>${Math.round(current)}</b><br>`;
  p.innerHTML += `Max: <b>${Math.round(max)}</b><br>`;
  p.innerHTML += `Min: <b>${Math.round(min)}</b><br>`;
  weatherField.append(p);
  weatherField.append(img);
}

function makeShowButtonVisible() {
  const input = document.querySelector('#input').value;
  if (input !== '') {
    const but = document.querySelector('button[type="submit"]');
    but.removeAttribute('disabled');
  } else {
    document
      .querySelector('button[type="submit"]')
      .setAttribute('disabled', '');
  }
}

function getCityWeather() {
  const input = document.querySelector('#input');
  const city = input.value;
  if (city !== '') {
    getCoordinatesByCity(city)
      .then((data) => {
        if (data.length === 0) {
          alert('Incorrect city name!');
        } else {
          addToHistory(data[0].name, data[0].lat, data[0].lon);
          showMap(data[0].lat, data[0].lon);
          showCity(data[0].name);
          getWeatherByCoordinates(data[0].lat, data[0].lon)
              .then((data) => {
                showWeather(data.main.temp, data.main.temp_min,
                    data.main.temp_max, data.weather[0].icon);
              });
        }
      })
  }

  input.value = '';
  const button = document.getElementById('show');
  button.setAttribute("disabled", '');
}

function getWeatherFromHistory(event) {
  let lat = event.target.getAttribute('data-lat');
  let lon = event.target.getAttribute('data-lon');
  getWeatherByCoordinates(lat, lon).then(data => {
    showMap(lat, lon);
    showCity(event.target.innerText);
    showWeather(
        data.main.temp,
        data.main.temp_min,
        data.main.temp_max,
        data.weather[0].icon,
    );
  });
}

window.addEventListener('load', findLocation);
const button = document.getElementById('show');
const input = document.querySelector('#input');
input.addEventListener('change', makeShowButtonVisible);
button.addEventListener('click', getCityWeather);
