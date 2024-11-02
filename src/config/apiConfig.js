export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  ENDPOINTS: {
    MASTOMYS_LOCATIONS: '/api/rat-locations',  // Updated to match Flask route
    LASSA_CASES: '/api/cases',                 // Updated to match Flask route
    ENVIRONMENTAL: '/api/environment',          // Updated to match Flask route
    UPLOAD: '/api/uploads',                    // Updated to match Flask route
    WEATHER: '/api/environment/weather'         // Subpath under environment
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