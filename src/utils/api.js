import { API_CONFIG } from '../config/apiConfig';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  throw error;
};

export const fetchMastomysLocations = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.MASTOMYS_DATA);
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
    const response = await fetch(API_CONFIG.ENDPOINTS.LASSA_CASES);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchEnvironmentalData = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.ENVIRONMENTAL_DATA);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'environmental data');
  }
};

export const fetchWeatherData = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.WEATHER);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'weather data');
  }
};

export const fetchTrainingProgress = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.TRAINING_DATA);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      progress: data.progress || 0,
      isTraining: data.is_training || false,
      metrics: data.metrics || {}
    };
  } catch (error) {
    return handleApiError(error, 'training progress');
  }
};