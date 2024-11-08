import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`API Error (${context}):`, error);
  const errorMessage = `Failed to fetch ${context}. ${error.message || ''}`;
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
  return { type: 'FeatureCollection', features: [] };
};

const safeRequest = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
};

export const fetchMastomysLocations = async () => {
  try {
    const data = await safeRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RAT_LOCATIONS}`);
    return data || { type: 'FeatureCollection', features: [] };
  } catch (error) {
    return handleApiError(error, 'Mastomys locations');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const data = await safeRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CASES}`);
    return data || { type: 'FeatureCollection', features: [] };
  } catch (error) {
    return handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const data = await safeRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER}`);
    return data || { layers: [] };
  } catch (error) {
    return handleApiError(error, 'weather layers');
  }
};

export const fetchEnvironmentalData = async () => {
  try {
    const data = await safeRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENVIRONMENTAL_DATA}`);
    return data || null;
  } catch (error) {
    return handleApiError(error, 'environmental data');
  }
};

export const fetchTrainingProgress = async () => {
  try {
    const data = await safeRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRAINING_PROGRESS}`);
    return data || { progress: 0, is_training: false };
  } catch (error) {
    return handleApiError(error, 'training progress');
  }
};