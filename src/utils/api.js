import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to fetch ${context} from Terrabox. Please try again later.`,
    variant: "destructive",
  });
  throw error;
};

export const fetchMastomysLocations = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.MASTOMYS_LOCATIONS);
    if (!response.ok) {
      throw new Error('Failed to fetch Mastomys locations from Terrabox');
    }
    const data = await response.json();
    if (!data || !data.features) {
      throw new Error('Invalid data format received from Terrabox');
    }
    return data;
  } catch (error) {
    handleApiError(error, 'Mastomys locations');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.CASES);
    if (!response.ok) {
      throw new Error('Failed to fetch Lassa fever cases from Terrabox');
    }
    const data = await response.json();
    if (!data || !data.features) {
      throw new Error('Invalid data format received from Terrabox');
    }
    return data;
  } catch (error) {
    handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchEnvironmentalData = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.ENVIRONMENTAL);
    if (!response.ok) {
      throw new Error('Failed to fetch environmental data from Terrabox');
    }
    const data = await response.json();
    if (!data) {
      throw new Error('Invalid environmental data format from Terrabox');
    }
    return data;
  } catch (error) {
    handleApiError(error, 'environmental data');
  }
};

export const fetchTrainingData = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.TRAINING_DATA);
    if (!response.ok) {
      throw new Error('Failed to fetch training data from Terrabox');
    }
    const data = await response.json();
    if (!data) {
      throw new Error('Invalid training data format from Terrabox');
    }
    return data;
  } catch (error) {
    handleApiError(error, 'training data');
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.WEATHER_LAYERS);
    if (!response.ok) {
      throw new Error('Failed to fetch weather layers from Terrabox');
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid weather layers format from Terrabox');
    }
    return data;
  } catch (error) {
    handleApiError(error, 'weather layers');
  }
};