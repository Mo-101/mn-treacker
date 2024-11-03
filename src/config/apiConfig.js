export const API_CONFIG = {
  ENDPOINTS: {
    MASTOMYS_LOCATIONS: 'mastomys-locations',
    CASES: 'lassa-cases',
    ENVIRONMENTAL: 'environmental',
    WEATHER: 'weather-data',
    WEATHER_LAYERS: 'https://terabox.com/s/1LE_5sz7dG8D0KtSKgyOJ4g'
  },

  TERRABOX: {
    BASE_URL: 'https://api.terrabox.com/v1/data',
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