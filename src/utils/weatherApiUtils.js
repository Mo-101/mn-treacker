const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getWeatherLayer = async (layer) => {
  return {
    type: 'raster',
    tiles: [`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
    tileSize: 512,
    maxzoom: 18
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
  return {
    type: 'raster',
    tiles: [`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
    tileSize: 512,
    maxzoom: 18
  };
};