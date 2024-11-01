/**
 * API Configuration and Environment Variables
 */

// Validate required environment variables
const requiredEnvVars = [
  'VITE_API_BASE_URL',
  'VITE_API_KEY',
  'VITE_POINTS_GEOJSON_PATH',
  'VITE_WEATHER_GEOJSON_PATH',
  'VITE_MN_GEOJSON_PATH'
];

requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
  }
});

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  ENDPOINTS: {
    // GeoJSON endpoints
    POINTS: import.meta.env.VITE_POINTS_GEOJSON_PATH,
    WEATHER: import.meta.env.VITE_WEATHER_GEOJSON_PATH,
    MN_DATA: import.meta.env.VITE_MN_GEOJSON_PATH,
    SLAYER: import.meta.env.VITE_SLAYER_GEOJSON_PATH,

    // CSV data files
    HISTORICAL_CASES: import.meta.env.VITE_HISTORICAL_CASES_CSV_PATH,
    CLIMATOLOGY: import.meta.env.VITE_CLIMATOLOGY_CSV_PATH,
    ADDRESS_POINTS: import.meta.env.VITE_ADDRESS_POINTS_PATH,

    // Training and AI endpoints
    TRAINING: import.meta.env.VITE_TRAINING_API_URL,
    UPLOAD_DATASET: import.meta.env.VITE_UPLOAD_DATASET_URL,
    RAT_LOCATIONS: import.meta.env.VITE_RAT_LOCATIONS_URL,
    CASES: import.meta.env.VITE_CASES_DATA_URL,
    WEATHER_DATA: import.meta.env.VITE_WEATHER_DATA_URL
  }
};

export const API_KEYS = {
  MAPBOX: import.meta.env.VITE_API_KEY,
  FIREBASE: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  },
  AZURE: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    tenantId: import.meta.env.VITE_AZURE_TENANT_ID,
    clientSecret: import.meta.env.VITE_AZURE_CLIENT_SECRET,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI
  }
};