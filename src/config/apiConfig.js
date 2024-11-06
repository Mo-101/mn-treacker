const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    WEATHER: `${BASE_URL}/api/weather`,
    MASTOMYS_DATA: `${BASE_URL}/api/rat-locations`,
    LASSA_CASES: `${BASE_URL}/api/cases`,
    WEATHER_HISTORICAL: `${BASE_URL}/api/historical-weather`,
    TRAINING_DATA: `${BASE_URL}/api/training-progress`
  },
  WEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY
};