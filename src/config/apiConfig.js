export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    POINTS: '/data/points',
    WEATHER: '/data/weather',
    RODENT_DATA: '/data/mn',
    TRAIN_MODEL: '/api/train-model',
    ANOMALY_DETECTION: '/api/anomaly-detection',
    DATA_ENRICHMENT: '/api/data-enrichment'
  }
};

export const API_KEYS = {
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  MAPBOX: import.meta.env.VITE_MAPBOX_TOKEN,
  AERIS: {
    ID: import.meta.env.VITE_XWEATHER_ID,
    SECRET: import.meta.env.VITE_XWEATHER_SECRET
  }
};