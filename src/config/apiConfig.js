export const API_CONFIG = {
  ENDPOINTS: {
    MASTOMYS_LOCATIONS: `/api/files/geojsonPaths/mnData`,
    CASES: `/api/files/csvPaths/historicalCases`,
    ENVIRONMENTAL: `/api/environmental`,
    WEATHER: `/api/weather-data`,
    WEATHER_LAYERS: `/api/weather-layers`,
    TRAINING_DATA: `/api/training-data`
  },

  TERRABOX: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || window.location.origin,
  }
};