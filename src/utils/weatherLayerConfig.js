const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const weatherLayers = [
  {
    id: 'temperature',
    name: 'Temperature',
    url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.8
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.8
  },
  {
    id: 'clouds',
    name: 'Clouds',
    url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.6
  },
  {
    id: 'wind',
    name: 'Wind',
    url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.7
  }
];