// import {getWeatherByCoordinates} from "src/openweathermap.js"

const YA_API_KEY = '';
const OWM_API_KEY = '';

async function getWeatherByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?&units=metric&lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`;
  let weatherPromise;
  try {
    weatherPromise = await fetch(url);
  } catch (error) {
    console.error('Error fetching OWM data', error);
  }
  return weatherPromise.json();
}

async function getCityByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${OWM_API_KEY}`;
  let geoPromise;
  try {
    geoPromise = await fetch(url);
  } catch (error) {
    console.error('Error fetching OWM data', error);
  }
  return geoPromise.json();
}

async function getCoordinatesByCity(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OWM_API_KEY}`;
  let coordinatesPromise;
  try {
    coordinatesPromise = await fetch(url);
  } catch (error) {
    console.error('Error fetching OWM data', error);
  }
  return coordinatesPromise.json();
}

window.addEventListener('load', findLocation);

const button = document.getElementById('show');

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

function showMap(lat, lon) {
  const map = document.getElementById('map');
  console.log('show map');
  // map.src = `https://static-maps.yandex.ru/v1?lang=ru_RU&ll=${lon},${lat}&spn=0.01,0.01&size=450,450&pt=${lon},${lat},pm2rdm,37.6341127,55.8238195&apikey=${YA_API_KEY}`;
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
  console.log(event.target.getAttribute('data-lat'));
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

const input = document.querySelector('#input');
input.addEventListener('change', makeShowButtonVisible);
button.addEventListener('click', getCityWeather);
