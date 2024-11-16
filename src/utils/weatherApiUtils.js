const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getOpenWeatherLayer = (layer) => {
  const baseUrl = 'https://tile.openweathermap.org/map';
  return {
    type: 'raster',
    tiles: [`${baseUrl}/${layer}/{z}/{x}/{y}.png?appid=${openWeatherApiKey}`],
    tileSize: 256,
    attribution: '© OpenWeatherMap'
  };
};

export const getOpenWeatherTemperatureLayer = () => {
  return getOpenWeatherLayer('temp_new');
};