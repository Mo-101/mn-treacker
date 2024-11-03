import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  throw error;
};

export const fetchMastomysLocations = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.MASTOMYS_LOCATIONS);
    if (!response.ok) {
      throw new Error('Failed to fetch Mastomys locations');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error, 'Mastomys locations');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.CASES);
    if (!response.ok) {
      throw new Error('Failed to fetch Lassa fever cases');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.WEATHER_LAYERS);
    if (!response.ok) {
      throw new Error('Failed to fetch weather layers');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error, 'weather layers');
  }
};