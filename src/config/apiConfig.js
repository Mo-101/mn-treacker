export const API_CONFIG = {
  RAT_LOCATIONS_API: process.env.VITE_RAT_LOCATIONS_API || '/api/rat-locations',
  LASSA_CASES_API: process.env.VITE_LASSA_CASES_API || '/api/cases',
  WEATHER_API: process.env.VITE_WEATHER_API || '/api/openweather',
  TRAINING_API: process.env.VITE_TRAINING_API || '/api/training-progress'
};

export const API_KEYS = {
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  MAPBOX: import.meta.env.VITE_MAPBOX_TOKEN,
  AERIS: {
    ID: import.meta.env.VITE_XWEATHER_ID,
    SECRET: import.meta.env.VITE_XWEATHER_SECRET
  }
};