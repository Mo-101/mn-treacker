const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    POINTS: `${API_BASE_URL}/api/points`,
    RAT_LOCATIONS: `${API_BASE_URL}/api/rat-locations`,
    CASES: `${API_BASE_URL}/api/cases`,
    ENVIRONMENTAL_DATA: `${API_BASE_URL}/api/weather_data`,
    TRAINING_DATA: `${API_BASE_URL}/api/training_progress`
  }
};