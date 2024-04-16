import {getCoordinatesByCity, getWeatherByCoordinates} from "./openweathermap";
import {showMap} from "./yamap";

export function addToHistory(city, lat, lon) {
    const history = document.getElementById('history');
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');
    const a = document.createElement('a');
    a.href = '#';
    a.innerHTML = city;
    a.setAttribute('data-lat', lat);
    a.setAttribute('data-lon', lon);
    a.onclick = getWeatherFromHistory;
    li.append(a);
    const list = history.querySelectorAll('li.list-group-item:not(li.active)');
    for (const value of list.values()) {
        let a = value.childNodes;
        if (a.item(0).innerText === city) return;
    }
    history.append(li);
    if (list.length > 9) history.removeChild(list[0]);
}

export function showCity(city) {
    const cityHeader = document.getElementById('city');
    cityHeader.innerText = city;
}
export function showWeather(current, min, max, icon) {
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

export function makeShowButtonVisible() {
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

export function getCityWeather() {
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

export function getWeatherFromHistory(event) {
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