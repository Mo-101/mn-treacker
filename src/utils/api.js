import { API_CONFIG } from '../config/apiConfig';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  throw error;
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

export const fetchMastomysLocations = async () => {
  try {
    const response = await fetch(`${API_CONFIG.ENDPOINTS.MASTOMYS_DATA}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Mastomys locations');
  }
};

export const fetchMnData = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/data/mn`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'mn data');
  }
};

export const fetchPointsData = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/data/points`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'points data');
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

export const fetchWeatherLayers = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.WEATHER);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error, 'weather layers');
  }
};
