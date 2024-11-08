import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to fetch ${context}. Please check your connection and try again.`,
    variant: "destructive",
  });
  return null;
};

const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      mode: 'cors',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Network error: Please check your connection and ensure the API server is running.');
    }
    throw error;
  }
};

export const fetchMastomysLocations = async () => {
  try {
    return await fetchWithErrorHandling(API_CONFIG.ENDPOINTS.MASTOMYS_DATA);
  } catch (error) {
    return handleApiError(error, 'Mastomys locations');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    return await fetchWithErrorHandling(API_CONFIG.ENDPOINTS.LASSA_CASES);
  } catch (error) {
    return handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchEnvironmentalData = async () => {
  try {
    return await fetchWithErrorHandling(API_CONFIG.ENDPOINTS.ENVIRONMENTAL_DATA);
  } catch (error) {
    return handleApiError(error, 'environmental data');
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const response = await fetchWithErrorHandling(API_CONFIG.ENDPOINTS.WEATHER);
    return response?.layers || [];
  } catch (error) {
    return handleApiError(error, 'weather layers');
  }
};

export const fetchTrainingProgress = async () => {
  try {
    return await fetchWithErrorHandling(API_CONFIG.ENDPOINTS.TRAINING_DATA);
  } catch (error) {
    return handleApiError(error, 'training progress');
  }
};