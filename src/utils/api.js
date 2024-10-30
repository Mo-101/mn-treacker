import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

/**
 * Handles API errors and displays user notifications
 * @param {Error} error - The error object
 * @param {string} context - The context in which the error occurred
 * @param {Response} [response] - Optional response object for status-specific handling
 */
const handleApiError = (error, context, response) => {
  console.error(`Error in ${context}:`, error);
  
  let description = `Failed to ${context}. Please try again later.`;
  
  if (response) {
    switch (response.status) {
      case 404:
        description = `Resource not found while trying to ${context}.`;
        break;
      case 401:
        description = `Authentication required to ${context}.`;
        break;
      case 403:
        description = `You don't have permission to ${context}.`;
        break;
      case 429:
        description = `Too many requests. Please try again later.`;
        break;
      case 500:
        description = `Server error while trying to ${context}. Please try again later.`;
        break;
    }
  }

  toast({
    title: "Error",
    description,
    variant: "destructive",
  });
  
  throw error;
};

/**
 * Generates a full URL for an API endpoint
 * @param {string} endpoint - The API endpoint path
 * @param {Object} [params] - Optional query parameters
 * @returns {string} The complete URL
 */
const getFullUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
};

export const fetchRatLocations = async () => {
  try {
    const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.RODENT_DATA));
    if (!response.ok) throw new Error('Failed to fetch rat data');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetch rat locations', error.response);
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.POINTS));
    if (!response.ok) throw new Error('Failed to fetch Lassa Fever cases');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetch Lassa Fever cases', error.response);
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    const url = getFullUrl(API_CONFIG.ENDPOINTS.WEATHER, { lat, lon });
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetch weather data', error.response);
  }
};

export const trainModel = async (data) => {
  try {
    const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.TRAIN_MODEL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to train model');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'train model', error.response);
  }
};

export const fetchDatasets = async () => {
  try {
    const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.DATASETS));
    if (!response.ok) throw new Error('Failed to fetch datasets');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetch datasets', error.response);
  }
};

export const uploadDataset = async (formData) => {
  try {
    const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.UPLOAD_DATASET), {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload dataset');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'upload dataset', error.response);
  }
};

export const fetchTrainingProgress = async () => {
  try {
    const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.TRAINING_PROGRESS));
    if (!response.ok) throw new Error('Failed to fetch training progress');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetch training progress', error.response);
  }
};