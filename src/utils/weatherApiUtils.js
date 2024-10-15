const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getWeatherLayer = (layer) => {
  const baseUrl = 'https://tile.openweathermap.org/map';
  const intensityParam = '&opacity=0.8&fill_bound=true';
  return {
    type: 'raster',
    tiles: [`${baseUrl}/${layer}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}${intensityParam}`],
    tileSize: 256,
    maxzoom: 19
  };
};

export const getPrecipitationLayer = () => {
  const baseUrl = 'https://tile.openweathermap.org/map/precipitation_new';
  return {
    type: 'raster',
    tiles: [`${baseUrl}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
    tileSize: 256,
    maxzoom: 19
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