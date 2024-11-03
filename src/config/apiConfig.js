export const API_CONFIG = {
  ENDPOINTS: {
    MASTOMYS_LOCATIONS: 'mastomys-locations',
    CASES: 'lassa-cases',
    ENVIRONMENTAL: 'environmental',
    WEATHER: 'weather-data',
    WEATHER_LAYERS: '/api/weather-layers',  // Changed to use backend proxy
    TRAINING_DATA: '/api/training-data'     // Changed to use backend proxy
  },

  TERRABOX: {
    BASE_URL: '/api/terrabox',  // Changed to use backend proxy
  },

  FALLBACK: {
    OPENWEATHER: `https://api.openweathermap.org/data/2.5/weather?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
  }
};

export const API_KEYS = {
  MAPBOX: import.meta.env.VITE_MAPBOX_TOKEN,
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  TERRABOX: import.meta.env.VITE_TERRABOX_TOKEN
};