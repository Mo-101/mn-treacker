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
  try {
    const response = await fetch(`/api/aeris-weather?layer=${layer}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Aeris weather data');
    }
    const data = await response.json();
    return {
      type: 'raster',
      tiles: [data.tileUrl],
      tileSize: 256
    };
  } catch (error) {
    console.error('Error fetching Aeris layer:', error);
    return null;
  }
};

const getOpenWeatherLayer = (layer) => {
  const baseUrl = 'https://tile.openweathermap.org/map';
  const intensityParam = '&opacity=0.8&fill_bound=true';
  return {
    type: 'raster',
    tiles: [`${baseUrl}/${layer}/{z}/{x}/{y}.png?appid=${openWeatherApiKey}${intensityParam}`],
    tileSize: 256
  };
};

export const getOpenWeatherTemperatureLayer = () => {
  return getOpenWeatherLayer('temp_new');
};

export const getWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`);
    const data = await response.json();
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};
