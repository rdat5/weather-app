import './style.css';
import { fromUnixTime, format } from 'date-fns';
import API_KEY from './apikey';

const citySearchBox = document.querySelector('.city-search-input');
const citySearchBtn = document.querySelector('.city-search-button');
const cfToggle = document.querySelector('#cf-toggle');
const temperatureElem = document.querySelector('.temperature');
const feelsLikeElem = document.querySelector('.feels-like');
const tempLowHighElem = document.querySelector('.temp-low-high');
const humidityElem = document.querySelector('.humidity');
const weatherIconElem = document.querySelector('.weather-icon');
const weatherMainElem = document.querySelector('.weather-main');
const weatherDescElem = document.querySelector('.weather-description');
const currentTimeElem = document.querySelector('.current-time');
const cityNameElem = document.querySelector('.city-name');

let isMetric = false;
let currentCity = 'Las Vegas';

function getWeatherIcon(iconCode) {
  let weatherIcon;
  switch (iconCode) {
    case '01d':
    case '01n':
      weatherIcon = '●';
      break;
    case '02d':
    case '02n':
      weatherIcon = '🌤';
      break;
    case '03d':
    case '03n':
      weatherIcon = '☁';
      break;
    case '04d':
    case '04n':
      weatherIcon = '☁☁';
      break;
    case '09d':
    case '09n':
      weatherIcon = '🌧';
      break;
    case '10d':
    case '10n':
      weatherIcon = '🌧🌧';
      break;
    case '11d':
    case '11n':
      weatherIcon = '⛈';
      break;
    case '13d':
    case '13n':
      weatherIcon = '❄';
      break;
    case '50d':
    case '50n':
      weatherIcon = '🌫';
      break;
    default:
      weatherIcon = '?';
      break;
  }
  return weatherIcon;
}

function updateAllWeatherElements(weatherData) {
  const dateTime = format(fromUnixTime(weatherData.dt), 'PPpp');

  let degreeUnit;

  if (isMetric) {
    degreeUnit = 'C';
  }
  else
  {
    degreeUnit = 'F';
  }

  temperatureElem.textContent = `${Math.round(weatherData.main.temp)}°${degreeUnit}`;
  feelsLikeElem.textContent = `Feels like ${Math.round(weatherData.main.feels_like)}°${degreeUnit}`;
  tempLowHighElem.textContent = `${Math.round(weatherData.main.temp_max)}°${degreeUnit} / ${Math.round(weatherData.main.temp_min)}°${degreeUnit}`;
  humidityElem.textContent = `Humidity: ${weatherData.main.humidity}%`;
  weatherIconElem.textContent = getWeatherIcon(weatherData.weather[0].icon);
  weatherMainElem.textContent = `${weatherData.weather[0].main}`;
  weatherDescElem.textContent = `${weatherData.weather[0].description}`;
  currentTimeElem.textContent = `As of ${dateTime}`;
}

function updateAllCityElements(cityData) {
  cityNameElem.textContent = `${cityData.name}, ${cityData.state}`;
}

function fetchWeatherFromCoordinates(lat, lon, units) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`, { mode: 'cors' })
    .then((response) => response.json())
    .then((response) => {
      updateAllWeatherElements(response);
    })
    .catch((err) => {
      console.log(`Error! ${err}`);
    });
}

function getWeatherFromCityName(city) {
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`, { mode: 'cors' })
    .then((response) => response.json())
    .then((response) => {
      let currentUnits;

      if (isMetric) {
        currentUnits = 'metric';
      }
      else
      {
        currentUnits = 'imperial';
      }

      const cityData = response[0];
      updateAllCityElements(cityData);
      fetchWeatherFromCoordinates(cityData.lat, cityData.lon, currentUnits);
    })
    .catch((err) => {
      console.log(`Error! ${err}`);
    });
}

cfToggle.addEventListener('input', () => {
  // console.log(cfToggle.checked);
  isMetric = cfToggle.checked;
  getWeatherFromCityName(currentCity);
});

citySearchBtn.addEventListener('click', () => {
  // console.log(citySearchBox.value);
  currentCity = citySearchBox.value;
  getWeatherFromCityName(currentCity);
  citySearchBox.value = '';
});
getWeatherFromCityName(currentCity);
