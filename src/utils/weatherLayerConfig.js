const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const weatherLayers = [
  {
    id: 'temperature',
    name: 'Temperature',
    url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.7,
    description: 'Shows temperature distribution'
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.7,
    description: 'Shows rainfall intensity'
  },
  {
    id: 'clouds',
    name: 'Cloud Cover',
    url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.6,
    description: 'Shows cloud coverage'
  },
  {
    id: 'wind',
    name: 'Wind Speed',
    url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.7,
    description: 'Shows wind speed and direction'
  }
];