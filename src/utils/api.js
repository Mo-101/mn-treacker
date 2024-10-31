import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

// Mock data for when API calls fail
const MOCK_DATA = {
  lassaFeverCases: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [8.6753, 9.0820]
        },
        properties: {
          severity: 'high',
          date: '2023-01-15',
          location: 'Lagos, Nigeria'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [7.4898, 9.0579]
        },
        properties: {
          severity: 'medium',
          date: '2023-02-01',
          location: 'Abuja, Nigeria'
        }
      }
    ]
  },
  environmentalData: {
    populationTrend: [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 2000 }
    ],
    habitatSuitability: [
      { area: 'Forest', suitability: 80 },
      { area: 'Urban', suitability: 30 }
    ]
  }
};

const handleApiError = (error, endpoint) => {
  console.warn(`API Error (${endpoint}):`, error);
  toast({
    title: "Using Demo Data",
    description: "Live data unavailable. Using sample data for demonstration.",
    variant: "warning",
  });
};

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
    handleApiError(error, 'environmental-data');
    return MOCK_DATA.environmentalData;
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    return await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HISTORICAL_CASES}`
    );
  } catch (error) {
    handleApiError(error, 'lassa-fever-cases');
    return MOCK_DATA.lassaFeverCases;
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    return await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}`
    );
  } catch (error) {
    handleApiError(error, 'weather-data');
    return null;
  }
};