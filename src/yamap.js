//import {YA_API_KEY} from "./config";
const YA_API_KEY = process.env.OWM_API_KEY;
export function showMap(lat, lon) {
    const map = document.getElementById('map');
    console.log("show map");
    //map.src = `https://static-maps.yandex.ru/v1?lang=ru_RU&ll=${lon},${lat}&spn=0.01,0.01&size=450,450&pt=${lon},${lat},pm2rdm,37.6341127,55.8238195&apikey=${YA_API_KEY}`;
}