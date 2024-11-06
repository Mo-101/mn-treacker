import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to fetch ${context}. Using cached data if available.`,
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
        ...options.headers
      },
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Fetch failed: ${error.message}`);
  }
};

export const fetchMastomysLocations = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    return await fetchWithErrorHandling(`${baseUrl}/api/rat-locations`);
  } catch (error) {
    return handleApiError(error, 'Mastomys locations');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    return await fetchWithErrorHandling(`${baseUrl}/api/cases`);
  } catch (error) {
    return handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const response = await fetchWithErrorHandling(`${baseUrl}/api/weather`);
    return response?.layers || [];
  } catch (error) {
    return handleApiError(error, 'weather layers');
  }
};

export const fetchTrainingProgress = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    return await fetchWithErrorHandling(`${baseUrl}/api/training-progress`);
  } catch (error) {
    return handleApiError(error, 'training progress');
  }
};