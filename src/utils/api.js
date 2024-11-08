import { API_CONFIG } from '../config/apiConfig';
import { useToast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to fetch ${context} from PostGIS database. Please check your database connection.`,
    variant: "destructive",
  });
  return null;
};

const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Database error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Database connection error: Please check if PostgreSQL server is running.');
    }
    throw error;
  }
};

export const fetchMastomysLocations = async () => {
  try {
    const response = await fetchWithErrorHandling(API_CONFIG.ENDPOINTS.MASTOMYS_DATA);
    return {
      type: 'FeatureCollection',
      features: response.map(point => ({
        type: 'Feature',
        geometry: point.geom,
        properties: {
          id: point.id,
          timestamp: point.observation_date,
          ...point.properties
        }
      }))
    };
  } catch (error) {
    return handleApiError(error, 'Mastomys locations');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetchWithErrorHandling(API_CONFIG.ENDPOINTS.LASSA_CASES);
    return {
      type: 'FeatureCollection',
      features: response.map(point => ({
        type: 'Feature',
        geometry: point.geom,
        properties: {
          id: point.id,
          timestamp: point.observation_date,
          ...point.properties
        }
      }))
    };
  } catch (error) {
    return handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchEnvironmentalData = async () => {
  try {
    return await fetchWithErrorHandling(API_CONFIG.ENDPOINTS.ENVIRONMENTAL_DATA);
  } catch (error) {
    return handleApiError(error, 'environmental data');
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const response = await fetchWithErrorHandling(API_CONFIG.ENDPOINTS.WEATHER);
    return {
      layers: response.map(data => ({
        id: data.id,
        type: data.weather_type,
        value: data.value,
        timestamp: data.observation_time
      }))
    };
  } catch (error) {
    return handleApiError(error, 'weather layers');
  }
};

export const fetchTrainingProgress = async () => {
  try {
    const response = await fetchWithErrorHandling(API_CONFIG.ENDPOINTS.TRAINING_DATA);
    return {
      progress: response.progress || 0,
      is_training: response.is_training || false,
      metrics: response.metrics || {}
    };
  } catch (error) {
    return handleApiError(error, 'training progress');
  }
};