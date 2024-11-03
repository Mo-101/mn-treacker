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

export const fetchWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(
      `${API_CONFIG.ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}&appid=${API_CONFIG.WEATHER_API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'weather data');
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

export const fetchWeatherForecast = async (lat, lon) => {
  try {
    const response = await fetch(
      `${API_CONFIG.ENDPOINTS.FORECAST}?lat=${lat}&lon=${lon}&appid=${API_CONFIG.WEATHER_API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather forecast');
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'weather forecast');
  }
};