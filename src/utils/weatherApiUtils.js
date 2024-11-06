const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getWeatherLayer = async (layer) => {
  const baseUrl = 'https://tile.openweathermap.org/map';
  return {
    type: 'raster',
    tiles: [`${baseUrl}/${layer}/{z}/{x}/{y}.png?appid=${openWeatherApiKey}`],
    tileSize: 256,
    attribution: 'Weather data © OpenWeather'
  };
};

export const getOpenWeatherTemperatureLayer = () => {
  return {
    type: 'raster',
    tiles: [`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${openWeatherApiKey}`],
    tileSize: 256,
    attribution: 'Weather data © OpenWeather'
  };
};