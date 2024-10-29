import { useQuery } from '@tanstack/react-query';
import { toast } from '../components/ui/use-toast';
import { API_CONFIG, API_KEYS } from '../config/apiConfig';

const handleFetchError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to fetch ${context}. Please try again later.`,
    variant: "destructive",
  });
  throw error;
};

const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('apiToken')}`,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const useGeoJSONPoints = () => {
  return useQuery({
    queryKey: ['points'],
    queryFn: () => fetchWithAuth(API_CONFIG.RAT_LOCATIONS_API),
    staleTime: 300000, // Cache for 5 minutes
    retry: 2,
    onError: (error) => handleFetchError(error, 'points data')
  });
};

export const useRatLocations = () => {
  return useQuery({
    queryKey: ['ratLocations'],
    queryFn: () => fetchWithAuth(API_CONFIG.RAT_LOCATIONS_API),
    staleTime: 60000,
    retry: 2,
    onError: (error) => handleFetchError(error, 'rat locations')
  });
};

export const useLassaFeverCases = () => {
  return useQuery({
    queryKey: ['lassaFeverCases'],
    queryFn: () => fetchWithAuth(API_CONFIG.LASSA_CASES_API),
    staleTime: 300000,
    retry: 2,
    onError: (error) => handleFetchError(error, 'Lassa Fever cases')
  });
};

export const useWeatherData = (lat, lon, layer = 'weather') => {
  const url = `${API_CONFIG.WEATHER_API}?lat=${lat}&lon=${lon}&layer=${layer}&appid=${API_KEYS.OPENWEATHER}`;
  
  return useQuery({
    queryKey: ['weatherData', lat, lon, layer],
    queryFn: () => fetchWithAuth(url),
    staleTime: 300000,
    retry: 2,
    onError: (error) => handleFetchError(error, 'weather data')
  });
};

export const useTrainingProgress = () => {
  return useQuery({
    queryKey: ['trainingProgress'],
    queryFn: () => fetchWithAuth(API_CONFIG.TRAINING_API),
    staleTime: 1000,
    refetchInterval: 1000,
    retry: 1,
    onError: (error) => handleFetchError(error, 'training progress')
  });
};