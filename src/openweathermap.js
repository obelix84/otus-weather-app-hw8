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
