import AerisWeather from '@aerisweather/javascript-sdk';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getWeatherLayer = async (layer) => {
  return getOpenWeatherLayer(layer);
};

const getOpenWeatherLayer = (layer) => {
  const baseUrl = 'https://tile.openweathermap.org/map';
  const intensityParam = '&opacity=1&fill_bound=true';  // Increase opacity for more intensity
  return {
    type: 'raster',
    tiles: [`${baseUrl}/${layer}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}${intensityParam}`],
    tileSize: 512,  // Increase tile size for higher resolution
    maxzoom: 20  // Increase max zoom for more detail
  };
};

export const fetchWeatherData = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return response.json();
};