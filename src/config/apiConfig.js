export const API_CONFIG = {
  ENDPOINTS: {
    WEATHER: `https://api.openweathermap.org/data/2.5/weather`,
    WEATHER_LAYERS: `https://tile.openweathermap.org/map`,
    FORECAST: `https://api.openweathermap.org/data/2.5/forecast`
  },

  WEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY
};