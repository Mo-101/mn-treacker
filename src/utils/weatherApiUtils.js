const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getWeatherLayer = async (layer) => {
  return getOpenWeatherLayer(layer);
};

const getOpenWeatherLayer = (layer) => {
  const baseUrl = 'https://tile.openweathermap.org/map';
  return {
    type: 'raster',
    tiles: [`${baseUrl}/${layer}/{z}/{x}/{y}.png?appid=${openWeatherApiKey}`],
    tileSize: 256
  };
};

export const fetchWeatherData = async (lat, lon) => {
  const response = await fetch(`/api/openweather?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return response.json();
};

export const getOpenWeatherTemperatureLayer = () => {
  return getOpenWeatherLayer('temp_new');
};