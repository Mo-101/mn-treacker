export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    RAT_LOCATIONS: '/api/rat-locations',
    CASES: '/api/cases',
    ENVIRONMENTAL_DATA: '/api/environmental-data',
    TRAINING_PROGRESS: '/api/training/progress',
    WEATHER: '/api/weather_data'
  }
};