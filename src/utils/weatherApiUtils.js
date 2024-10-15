import AerisWeather from '@aerisweather/javascript-sdk';

const aeris = new AerisWeather(import.meta.env.VITE_XWEATHER_ID, import.meta.env.VITE_XWEATHER_SECRET);
const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getWeatherLayer = async (layer) => {
  try {
    const aerisLayer = await getAerisLayer(layer);
    if (aerisLayer) return aerisLayer;
  } catch (error) {
    console.error('Aeris API error:', error);
  }

  return getOpenWeatherLayer(layer);
};

const getAerisLayer = async (layer) => {
  // Implement Aeris layer fetching logic here
  // Return null if the API is down or rate limited
  return null;
};

const getOpenWeatherLayer = (layer) => {
  const baseUrl = 'https://tile.openweathermap.org/map';
  return {
    type: 'raster',
    tiles: [`${baseUrl}/${layer}/{z}/{x}/{y}.png?appid=${openWeatherApiKey}`],
    tileSize: 256
  };
};