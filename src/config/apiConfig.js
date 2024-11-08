export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    RAT_LOCATIONS: '/weather_data',
    CASES: '/cases',
    ENVIRONMENTAL_DATA: '/environmental-data',
    TRAINING_PROGRESS: '/training/progress',
    WEATHER: '/weather_data'
  }
};