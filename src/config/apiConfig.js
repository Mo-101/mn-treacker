export const API_CONFIG = {
  ENDPOINTS: {
    WEATHER: `https://api.openweathermap.org/data/2.5/weather`,
    WEATHER_LAYERS: `https://tile.openweathermap.org/map`,
    FORECAST: `https://api.openweathermap.org/data/2.5/forecast`,
    MASTOMYS_DATA: `https://www.terabox.com/sharing/link?surl=mastomys_data`,
    WEATHER_HISTORICAL: `https://www.terabox.com/sharing/link?surl=weather_data.geojson`,
    TRAINING_DATA: `https://www.terabox.com/sharing/link?surl=training_progress`
  },

  WEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
  TERABOX_TOKEN: import.meta.env.VITE_TERRABOX_TOKEN
};