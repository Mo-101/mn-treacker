import AerisWeather from '@aerisweather/javascript-sdk';

const aeris = new AerisWeather(import.meta.env.VITE_XWEATHER_ID, import.meta.env.VITE_XWEATHER_SECRET);
const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getWeatherLayer = async (layer) => {
  try {
    const response = await fetch(`https://api.aerisapi.com/maps/${layer}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_XWEATHER_ID}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch weather data');
    
    const data = await response.json();
    return {
      type: 'raster',
      tiles: [data.tileUrl],
      tileSize: 256,
      attribution: 'Weather data © AerisWeather'
    };
  } catch (error) {
    console.error('Error fetching weather layer:', error);
    return getOpenWeatherLayer(layer);
  }
};

const getOpenWeatherLayer = (layer) => {
  const baseUrl = 'https://tile.openweathermap.org/map';
  return {
    type: 'raster',
    tiles: [`${baseUrl}/${layer}/{z}/{x}/{y}.png?appid=${openWeatherApiKey}`],
    tileSize: 256,
    attribution: 'Weather data © OpenWeather'
  };
};

export const getOpenWeatherTemperatureLayer = () => {
  return getOpenWeatherLayer('temp_new');
};