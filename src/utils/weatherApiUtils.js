import AerisWeather from '@aerisweather/javascript-sdk';

const aeris = new AerisWeather(import.meta.env.VITE_XWEATHER_ID, import.meta.env.VITE_XWEATHER_SECRET);

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
    const response = await fetch(`/api/aeris-weather?layer=${layer}&resolution=high`);
    if (!response.ok) {
      throw new Error('Failed to fetch Aeris weather data');
    }
    const data = await response.json();
    return {
      type: 'raster',
      tiles: [data.tileUrl],
      tileSize: 512,  // Increase tile size for higher resolution
      maxzoom: 20  // Increase max zoom for more detail
    };
  } catch (error) {
    console.error('Error fetching Aeris layer:', error);
    return null;
  }
};

const getOpenWeatherLayer = (layer) => {
  const baseUrl = 'https://tile.openweathermap.org/map';
  const intensityParam = '&opacity=1&fill_bound=true';  // Increase opacity for more intensity
  return {
    type: 'raster',
    tiles: [`${baseUrl}/${layer}/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}${intensityParam}`],
    tileSize: 512,  // Increase tile size for higher resolution
    maxzoom: 20  // Increase max zoom for more detail
  };
};