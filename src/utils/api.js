import { API_CONFIG, API_KEYS } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  toast({
    title: "Backend Connection Error",
    description: "Falling back to alternative data sources.",
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

// OpenWeather API fallback
const fetchOpenWeatherData = async (lat, lon) => {
  const url = `${API_CONFIG.FALLBACK.OPENWEATHER}&lat=${lat}&lon=${lon}&units=metric`;
  const response = await fetch(url);
  return response.json();
};

// Terrabox API fallback
const fetchTerraboxData = async (endpoint) => {
  const url = `${API_CONFIG.FALLBACK.TERRABOX}/${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEYS.TERRABOX}`
    }
  });
  return response.json();
};

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ENVIRONMENTAL}/data?timeframe=${timeframe}`
    );
    return response;
  } catch (error) {
    handleApiError(error, 'environmental data');
    try {
      return await fetchTerraboxData('environmental');
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return {
        temperature: 25,
        humidity: 60,
        rainfall: 100
      };
    }
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LASSA_CASES}`);
    return response;
  } catch (error) {
    handleApiError(error, 'Lassa fever cases');
    try {
      return await fetchTerraboxData('lassa-cases');
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return [];
    }
  }
};

export const fetchMastomysLocations = async () => {
  try {
    const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MASTOMYS_LOCATIONS}`);
    return response;
  } catch (error) {
    handleApiError(error, 'Mastomys natalensis locations');
    try {
      return await fetchTerraboxData('mastomys-locations');
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return [];
    }
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}`
    );
    return response;
  } catch (error) {
    handleApiError(error, 'weather data');
    try {
      return await fetchOpenWeatherData(lat, lon);
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return {
        temperature: 25,
        humidity: 60,
        rainfall: 100
      };
    }
  }
};
