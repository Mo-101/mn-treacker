export const API_CONFIG = {
  ENDPOINTS: {
    MASTOMYS_LOCATIONS: '/files/geojsonPaths/mnData',
    CASES: '/files/csvPaths/historicalCases',
    ENVIRONMENTAL: 'environmental',
    WEATHER: 'weather-data',
    WEATHER_LAYERS: '/api/weather-layers',
    TRAINING_DATA: '/api/training-data'
  },

  TERRABOX: {
    BASE_URL: '/api/terrabox',
  },

  FALLBACK: {
    OPENWEATHER: `https://api.openweathermap.org/data/2.5/weather?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
  }
};

export const API_KEYS = {
  MAPBOX: import.meta.env.VITE_MAPBOX_TOKEN,
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
};