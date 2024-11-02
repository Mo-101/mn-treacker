export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  ENDPOINTS: {
    MASTOMYS_LOCATIONS: '/api/rat-locations',
    CASES: '/api/cases',
    ENVIRONMENTAL: '/api/environment',
    UPLOAD: '/api/uploads',
    WEATHER: '/api/environment/weather',
    TRAINING: '/api/uploads/training'
  },

  FALLBACK: {
    OPENWEATHER: `https://api.openweathermap.org/data/2.5/weather?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
    TERRABOX: 'https://api.terrabox.com/v1/data' // Replace with actual Terrabox API endpoint
  }
};

export const API_KEYS = {
  MAPBOX: import.meta.env.VITE_MAPBOX_TOKEN,
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  XWEATHER: {
    id: import.meta.env.VITE_XWEATHER_ID,
    secret: import.meta.env.VITE_XWEATHER_SECRET
  },
  TERRABOX: import.meta.env.VITE_TERRABOX_TOKEN
};