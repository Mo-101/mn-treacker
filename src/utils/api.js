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

// Weather data fetching is temporarily disabled
export const fetchWeatherData = async () => {
  return null;
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