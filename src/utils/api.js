import { API_CONFIG } from '../config/apiConfig';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  throw error;
};

export const fetchMastomysLocations = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/mn`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Mastomys locations');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/cases`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchEnvironmentalData = async () => {
  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=0&lon=0&appid=${OPENWEATHER_API_KEY}&units=metric`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      populationTrend: [
        { month: 'Jan', actual: data.main.temp, predicted: data.main.feels_like },
        { month: 'Feb', actual: data.main.humidity, predicted: data.main.pressure },
      ],
      habitatSuitability: [
        { area: 'Forest', suitability: data.clouds.all },
        { area: 'Grassland', suitability: data.main.humidity },
        { area: 'Urban', suitability: 100 - data.clouds.all },
        { area: 'Wetland', suitability: data.main.humidity },
      ]
    };
  } catch (error) {
    return handleApiError(error, 'environmental data');
  }
};

export const fetchTrainingProgress = async () => {
  try {
    const response = await fetch(`${API_CONFIG.ENDPOINTS.TRAINING_PROGRESS}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'training progress');
  }
};

export const fetchWeatherLayers = async () => {
  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  return {
    layers: [
      {
        id: 'temperature',
        type: 'raster',
        source: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      },
      {
        id: 'precipitation',
        type: 'raster',
        source: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      },
      {
        id: 'clouds',
        type: 'raster',
        source: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      },
      {
        id: 'wind',
        type: 'raster',
        source: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      }
    ]
  };
};