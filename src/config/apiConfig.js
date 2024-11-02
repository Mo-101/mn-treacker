export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  ENDPOINTS: {
    RAT_LOCATIONS: '/api/rat-locations',
    CASES: '/api/cases',
    ENVIRONMENTAL: '/api/environment/data',
    WEATHER: '/api/environment/weather',
    UPLOAD: '/api/uploads/dataset'
  }
};

export const API_KEYS = {
  MAPBOX: import.meta.env.VITE_MAPBOX_TOKEN,
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  XWEATHER: {
    id: import.meta.env.VITE_XWEATHER_ID,
    secret: import.meta.env.VITE_XWEATHER_SECRET
  }
};