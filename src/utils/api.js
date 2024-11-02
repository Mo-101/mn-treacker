import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  toast({
    title: "Backend Connection Error",
    description: "The backend service is not available yet. Using fallback data.",
    variant: "warning",
  });
  return null;
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

// Fallback data when backend is not available
const fallbackData = {
  environmentalData: {
    temperature: 25,
    humidity: 60,
    rainfall: 100
  },
  lassaCases: [],
  mastomysLocations: []
};

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    return await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENVIRONMENTAL}/data?timeframe=${timeframe}`
    );
  } catch (error) {
    handleApiError(error, 'environmental data');
    return fallbackData.environmentalData;
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LASSA_CASES}`);
    return response;
  } catch (error) {
    handleApiError(error, 'Lassa fever cases');
    return fallbackData.lassaCases;
  }
};

export const fetchMastomysLocations = async () => {
  try {
    const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MASTOMYS_LOCATIONS}`);
    return response;
  } catch (error) {
    handleApiError(error, 'Mastomys natalensis locations');
    return fallbackData.mastomysLocations;
  }
};

export const uploadDataset = async (formData) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD}/dataset`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, 'dataset upload');
    return { success: false, message: 'Backend not available' };
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    return await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}`
    );
  } catch (error) {
    handleApiError(error, 'weather data');
    return fallbackData.environmentalData;
  }
};