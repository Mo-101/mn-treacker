import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to fetch ${context}. Please try again later.`,
    variant: "destructive",
  });
  return null;
};

const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export const fetchMastomysLocations = async () => {
  try {
    return await fetchWithRetry(`${API_CONFIG.ENDPOINTS.MASTOMYS_DATA}`, {
      mode: 'cors'
    });
  } catch (error) {
    return handleApiError(error, 'Mastomys locations');
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    return await fetchWithRetry(
      `${API_CONFIG.ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}&appid=${API_CONFIG.WEATHER_API_KEY}&units=metric`,
      { mode: 'cors' }
    );
  } catch (error) {
    return handleApiError(error, 'weather data');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    return await fetchWithRetry(`${API_CONFIG.ENDPOINTS.LASSA_CASES}`, {
      mode: 'cors'
    });
  } catch (error) {
    return handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchEnvironmentalData = async () => {
  try {
    const weatherData = await fetchWithRetry(API_CONFIG.ENDPOINTS.WEATHER_HISTORICAL, {
      mode: 'cors'
    });
    return {
      populationTrend: weatherData?.populationTrend || [],
      habitatSuitability: weatherData?.habitatSuitability || []
    };
  } catch (error) {
    return handleApiError(error, 'environmental data');
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const layers = ['temp_new', 'precipitation_new', 'clouds_new', 'wind_new'];
    return layers.map(layer => ({
      id: layer.replace('_new', ''),
      url: `${API_CONFIG.ENDPOINTS.WEATHER_LAYERS}/${layer}/{z}/{x}/{y}.png?appid=${API_CONFIG.WEATHER_API_KEY}`
    }));
  } catch (error) {
    return handleApiError(error, 'weather layers');
  }
};

export const fetchTrainingProgress = async () => {
  try {
    return await fetchWithRetry(API_CONFIG.ENDPOINTS.TRAINING_DATA, {
      mode: 'cors'
    });
  } catch (error) {
    return handleApiError(error, 'training progress');
  }
};