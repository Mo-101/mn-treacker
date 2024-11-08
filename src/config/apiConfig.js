const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_CONFIG = {
  ENDPOINTS: {
    WEATHER: `${API_BASE_URL}/api/weather`,
    MASTOMYS_DATA: `${API_BASE_URL}/api/rat-locations`,
    LASSA_CASES: `${API_BASE_URL}/api/cases`,
    TRAINING_DATA: `${API_BASE_URL}/api/training-progress`,
    ENVIRONMENTAL_DATA: `${API_BASE_URL}/api/environmental-data`
  },
  WEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY
};