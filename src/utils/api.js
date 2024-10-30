import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const MOCK_DATA = {
  historicalCases: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [8.6753, 9.0820] // Nigeria coordinates
        },
        properties: {
          severity: 'high',
          date: '2023-01-15',
          location: 'Lagos, Nigeria'
        }
      }
    ]
  }
};

const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Fetch error:', error);
    // Return mock data if the API is not available
    if (url.includes('historicalCases')) {
      return MOCK_DATA.historicalCases;
    }
    toast({
      title: "Warning",
      description: "Using fallback data due to API unavailability",
      variant: "warning",
    });
    throw error;
  }
};

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  return fetchWithErrorHandling(`${API_CONFIG.BASE_URL}/api/environmental-data?timeframe=${timeframe}`);
};

export const fetchRatData = async (locationId) => {
  return fetchWithErrorHandling(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MN_DATA}${locationId ? `/${locationId}` : ''}`);
};

export const fetchLassaFeverCases = async () => {
  return fetchWithErrorHandling(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HISTORICAL_CASES}`);
};

export const fetchWindData = async (timestamp) => {
  const baseEndpoint = API_CONFIG.ENDPOINTS.WIND_DATA[timestamp];
  if (!baseEndpoint) {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }
  
  const [jsonData, imageBlob] = await Promise.all([
    fetchWithErrorHandling(`${API_CONFIG.BASE_URL}${baseEndpoint}.json`),
    fetch(`${API_CONFIG.BASE_URL}${baseEndpoint}.png`).then(res => res.blob())
  ]);

  return {
    data: jsonData,
    image: URL.createObjectURL(imageBlob)
  };
};

export const fetchWeatherData = async (lat, lon) => {
  return fetchWithErrorHandling(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}`);
};