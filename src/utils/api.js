import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to fetch ${context}. Please try again later.`,
    variant: "destructive",
  });
  return null;
};

const createApiUrl = (endpoint) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  return `${baseUrl}${endpoint}`;
};

export const fetchMastomysLocations = async () => {
  try {
    const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.MASTOMYS_LOCATIONS));
    if (!response.ok) {
      throw new Error('Failed to fetch Mastomys locations');
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Mastomys locations');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.CASES));
    if (!response.ok) {
      throw new Error('Failed to fetch Lassa fever cases');
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    const response = await fetch(createApiUrl(`${API_CONFIG.ENDPOINTS.ENVIRONMENTAL}?timeframe=${timeframe}`));
    if (!response.ok) {
      throw new Error('Failed to fetch environmental data');
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'environmental data');
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.WEATHER_LAYERS));
    if (!response.ok) {
      throw new Error('Failed to fetch weather layers');
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'weather layers');
  }
};

export const streamFromTeraBox = async (streamId) => {
  try {
    const response = await fetch(createApiUrl(`/stream/${streamId}`), {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TERRABOX_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the stream');
    }

    return response.body.getReader();
  } catch (error) {
    return handleApiError(error, 'TeraBox stream');
  }
};