export const API_CONFIG = {
  ENDPOINTS: {
    MASTOMYS_LOCATIONS: `${import.meta.env.VITE_API_BASE_URL}/api/files/geojsonPaths/mnData`,
    CASES: `${import.meta.env.VITE_API_BASE_URL}/api/files/csvPaths/historicalCases`,
    ENVIRONMENTAL: `${import.meta.env.VITE_API_BASE_URL}/api/environmental`,
    WEATHER: `${import.meta.env.VITE_API_BASE_URL}/api/weather-data`,
    WEATHER_LAYERS: `${import.meta.env.VITE_API_BASE_URL}/api/weather-layers`,
    TRAINING_DATA: `${import.meta.env.VITE_API_BASE_URL}/api/training-data`
  },

  TERRABOX: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL,
  }
};