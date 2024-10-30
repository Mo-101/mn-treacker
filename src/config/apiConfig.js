/**
 * API Configuration and Environment Variables
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

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  ENDPOINTS: {
    // GeoJSON endpoints
    POINTS: '/api/files/geojsonPaths/points',
    WEATHER: '/api/files/geojsonPaths/weather',
    MN_DATA: '/api/files/geojsonPaths/mnData',
    SLAYER: '/api/files/geojsonPaths/slayer',

    // CSV data files
    HISTORICAL_CASES: '/api/files/csvPaths/historicalCases',
    CLIMATOLOGY: '/api/files/csvPaths/climatology',
    ADDRESS_POINTS: '/api/files/csvPaths/addressPointsV2',

    // Wind Data timestamps
    WIND_DATA: {
      '2016112000': '/api/files/windData/2016112000',
      '2016112006': '/api/files/windData/2016112006',
      '2016112012': '/api/files/windData/2016112012',
      '2016112018': '/api/files/windData/2016112018',
      '2016112100': '/api/files/windData/2016112100',
      '2016112106': '/api/files/windData/2016112106',
      '2016112112': '/api/files/windData/2016112112',
      '2016112118': '/api/files/windData/2016112118',
      '2016112200': '/api/files/windData/2016112200'
    }
  }
};

/**
 * API authentication keys from environment variables
 */
export const API_KEYS = {
  MAPBOX: import.meta.env.VITE_MAPBOX_TOKEN,
  OPENWEATHER: import.meta.env.VITE_OPENWEATHER_API_KEY,
  AERIS: {
    ID: import.meta.env.VITE_XWEATHER_ID,
    SECRET: import.meta.env.VITE_XWEATHER_SECRET
  }
};