import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to ${context}. Please try again later.`,
    variant: "destructive",
  });
  throw error;
};

export const fetchRatLocations = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RODENT_DATA}`);
    if (!response.ok) throw new Error('Failed to fetch rat data');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetch rat locations');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POINTS}`);
    if (!response.ok) throw new Error('Failed to fetch Lassa Fever cases');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetch Lassa Fever cases');
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetch weather data');
  }
};

export const trainModel = async (data) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRAIN_MODEL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to train model');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'train model');
  }
};

export const detectAnomalies = async (data) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANOMALY_DETECTION}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to detect anomalies');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'detect anomalies');
  }
};

export const enrichData = async (data) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DATA_ENRICHMENT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to enrich data');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'enrich data');
  }
};