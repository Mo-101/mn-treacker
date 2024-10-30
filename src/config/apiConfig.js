/**
 * API Configuration and Environment Variables
 * 
 * This module contains all API endpoints and authentication keys.
 * All environment variables must be prefixed with VITE_ to be exposed to the client.
 */

// Validate required environment variables
const requiredEnvVars = [
  'VITE_MAPBOX_TOKEN',
  'VITE_OPENWEATHER_API_KEY',
  'VITE_XWEATHER_ID',
  'VITE_XWEATHER_SECRET'
];

requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
  }
});

/**
 * API endpoint configuration
 * Contains all backend endpoints used by the application
 */
export const API_CONFIG = {
  // Base URL for all API endpoints
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  ENDPOINTS: {
    // GeoJSON points for visualization
    POINTS: '/data/points',
    
    // Weather data endpoint
    WEATHER: '/data/weather',
    
    // Rodent detection data
    RODENT_DATA: '/data/mn',
    
    // ML model endpoints
    TRAIN_MODEL: '/api/train-model',
    ANOMALY_DETECTION: '/api/anomaly-detection',
    DATA_ENRICHMENT: '/api/data-enrichment',
    
    // Dataset management
    DATASETS: '/api/datasets',
    TRAINING_PROGRESS: '/api/training-progress',
    UPLOAD_DATASET: '/api/upload-dataset'
  }
};

/**
 * API authentication keys
 * These are loaded from environment variables and validated at runtime
 */
export const API_KEYS = {
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  MAPBOX: import.meta.env.VITE_MAPBOX_TOKEN,
  AERIS: {
    ID: import.meta.env.VITE_XWEATHER_ID,
    SECRET: import.meta.env.VITE_XWEATHER_SECRET
  }
};