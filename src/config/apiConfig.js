const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_CONFIG = {
  ENDPOINTS: {
    WEATHER: `${API_BASE_URL}/api/weather_data`,
    MASTOMYS_DATA: `${API_BASE_URL}/api/rat-locations`,
    LASSA_CASES: `${API_BASE_URL}/api/cases`,
    LOCATIONS: `${API_BASE_URL}/api/locations`,
    ENVIRONMENTAL_DATA: `${API_BASE_URL}/api/environmental_data`,
    TRAINING_DATA: `${API_BASE_URL}/api/training_progress`
  },
  DB_CONFIG: {
    host: 'localhost',
    port: 5432,
    database: 'MoBase',
    user: 'mobase_user',
    password: 'mobase_password'
  }
};