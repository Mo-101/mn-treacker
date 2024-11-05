export const API_CONFIG = {
  ENDPOINTS: {
    WEATHER: `${import.meta.env.VITE_API_BASE_URL}/api/weather`,
    MASTOMYS_DATA: `${import.meta.env.VITE_API_BASE_URL}/api/rat-locations`,
    LASSA_CASES: `${import.meta.env.VITE_API_BASE_URL}/api/cases`,
    WEATHER_HISTORICAL: `${import.meta.env.VITE_API_BASE_URL}/api/historical-weather`,
    TRAINING_DATA: `${import.meta.env.VITE_API_BASE_URL}/api/training-progress`
  },
  WEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY
};