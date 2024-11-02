import { toast } from '../components/ui/use-toast';
import { API_CONFIG } from '../config/apiConfig';

export const fetchRatLocations = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RAT_LOCATIONS}`);
    if (!response.ok) {
      throw new Error('Failed to fetch rat data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rat data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch rat data. Please check your data source configuration.",
      variant: "destructive",
    });
    return { type: 'FeatureCollection', features: [] };
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CASES}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Lassa Fever cases');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Lassa Fever cases:', error);
    toast({
      title: "Error",
      description: "Failed to fetch Lassa Fever cases. Please check your data source configuration.",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchWeatherData = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch weather data. Please check your data source configuration.",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchTrainingProgress = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRAINING}`);
    if (!response.ok) {
      throw new Error('Failed to fetch training progress');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching training progress:', error);
    return { progress: 0, is_training: false };
  }
};