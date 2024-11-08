const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5432';
const DB_NAME = 'MoBase';

export const API_CONFIG = {
  ENDPOINTS: {
    WEATHER: `${API_BASE_URL}/${DB_NAME}/weather_data`,
    MASTOMYS_DATA: `${API_BASE_URL}/${DB_NAME}/mn_geog`,
    LASSA_CASES: `${API_BASE_URL}/${DB_NAME}/points_geog`,
    LOCATIONS: `${API_BASE_URL}/${DB_NAME}/locations`,
    ENVIRONMENTAL_DATA: `${API_BASE_URL}/${DB_NAME}/weather_data`,
    TRAINING_DATA: `${API_BASE_URL}/${DB_NAME}/training_progress`
  },
  DB_CONFIG: {
    host: 'localhost',
    port: 5432,
    database: 'MoBase',
    user: 'postgres',
    password: 'mostar'
  }
};