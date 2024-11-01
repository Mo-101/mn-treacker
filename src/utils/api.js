import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

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
    throw error;
  }
};

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    return await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/api/environmental-data?timeframe=${timeframe}`
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
    const response = await fetch('/api/files/geojsonPaths/points');
    if (!response.ok) {
      throw new Error('Failed to fetch points data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching points data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch points data",
      variant: "destructive",
    });
    return { type: 'FeatureCollection', features: [] };
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    return await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}`
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
    const response = await fetch('/api/files/geojsonPaths/points');
    if (!response.ok) {
      throw new Error('Failed to fetch points data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching points data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch points data",
      variant: "destructive",
    });
    return { type: 'FeatureCollection', features: [] };
  }
};