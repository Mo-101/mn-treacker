import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';
import { reportError } from './errorReporting';

const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    reportError(error, { request: { url, ...options } });
    throw error;
  }
};

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    return await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/environmental-data?timeframe=${timeframe}`
    );
  } catch (error) {
    console.error('API Error:', error);
    toast({
      title: "Error",
      description: "Failed to fetch environmental data",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.CASES);
    if (!response.ok) {
      throw new Error('Failed to fetch cases data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cases data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch cases data",
      variant: "destructive",
    });
    return { type: 'FeatureCollection', features: [] };
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    return await fetchWithTimeout(
      `${API_CONFIG.ENDPOINTS.WEATHER_DATA}?lat=${lat}&lon=${lon}`
    );
  } catch (error) {
    console.error('API Error:', error);
    toast({
      title: "Error",
      description: "Failed to fetch weather data",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchRatData = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.RAT_LOCATIONS);
    if (!response.ok) {
      throw new Error('Failed to fetch rat location data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rat location data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch rat location data",
      variant: "destructive",
    });
    return { type: 'FeatureCollection', features: [] };
  }
};