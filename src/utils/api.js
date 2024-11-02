import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to fetch ${context}. Please try again later.`,
    variant: "destructive",
  });
  throw error;
};

const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    return await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/api/environment/data?timeframe=${timeframe}`
    );
  } catch (error) {
    return handleApiError(error, 'environmental data');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/api/cases`);
    return response;
  } catch (error) {
    return handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchRatLocations = async () => {
  try {
    const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/api/rat-locations`);
    return response;
  } catch (error) {
    return handleApiError(error, 'rat locations');
  }
};

export const uploadDataset = async (formData) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/uploads/dataset`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'dataset upload');
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    return await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/api/environment/weather?lat=${lat}&lon=${lon}`
    );
  } catch (error) {
    return handleApiError(error, 'weather data');
  }
};