//import {OWM_API_KEY} from "./config";
//require('dotenv').config();
const OWM_API_KEY = process.env.OWM_API_KEY;

export async function getWeatherByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?&units=metric&lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`;
    let weatherPromise;
    try {
        weatherPromise = await fetch(url);
    } catch (error) {
        console.error('Error fetching OWM data', error);
    }
    return weatherPromise.json();
}

export async function getCityByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${OWM_API_KEY}`;
    let geoPromise;
    try {
        geoPromise = await fetch(url);
    } catch (error) {
        console.error('Error fetching OWM data', error);
    }
    return geoPromise.json();
}

export async function getCoordinatesByCity(city) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OWM_API_KEY}`;
    let coordinatesPromise;
    try {
        coordinatesPromise = await fetch(url);
    } catch (error) {
        console.error('Error fetching OWM data', error);
    }
    return coordinatesPromise.json();
}