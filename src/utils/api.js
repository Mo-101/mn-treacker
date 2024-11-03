import { API_CONFIG, API_KEYS } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const fetchFromTerrabox = async (endpoint) => {
  const url = `${API_CONFIG.TERRABOX.BASE_URL}/${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEYS.TERRABOX}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// OpenWeather API for weather data
const fetchOpenWeatherData = async (lat, lon) => {
  const url = `${API_CONFIG.FALLBACK.OPENWEATHER}&lat=${lat}&lon=${lon}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    return await fetchFromTerrabox(`${API_CONFIG.ENDPOINTS.ENVIRONMENTAL}?timeframe=${timeframe}`);
  } catch (error) {
    console.error('Error fetching environmental data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch environmental data",
      variant: "destructive",
    });
    return {
      temperature: 25,
      humidity: 60,
      rainfall: 100
    };
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    return await fetchFromTerrabox(API_CONFIG.ENDPOINTS.CASES);
  } catch (error) {
    console.error('Error fetching Lassa fever cases:', error);
    toast({
      title: "Error",
      description: "Failed to fetch Lassa fever cases",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchMastomysLocations = async () => {
  try {
    return await fetchFromTerrabox(API_CONFIG.ENDPOINTS.MASTOMYS_LOCATIONS);
  } catch (error) {
    console.error('Error fetching Mastomys locations:', error);
    toast({
      title: "Error",
      description: "Failed to fetch Mastomys locations",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    const weatherData = await fetchOpenWeatherData(lat, lon);
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch weather data",
      variant: "destructive",
    });
    return {
      temperature: 25,
      humidity: 60,
      rainfall: 100
    };
  }
};