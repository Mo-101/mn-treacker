import { API_CONFIG } from '../config/apiConfig';

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

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    const response = await fetch(`${API_CONFIG.ENDPOINTS.ENVIRONMENTAL}?timeframe=${timeframe}`);
    if (!response.ok) {
      throw new Error('Failed to fetch environmental data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error, 'environmental data');
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

export const streamFromTeraBox = async (streamId) => {
  try {
    const response = await fetch(`${API_CONFIG.TERRABOX.BASE_URL}/stream/${streamId}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TERRABOX_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the stream');
    }

    const reader = response.body.getReader();
    return reader;
  } catch (error) {
    handleApiError(error, 'TeraBox stream');
  }
};