import { useQuery } from '@tanstack/react-query';
import { toast } from '../components/ui/use-toast';

// Centralized error handler
const handleFetchError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to fetch ${context}. Please try again later.`,
    variant: "destructive",
  });
  throw error;
};

// Optimized fetching functions with proper caching
export const useGeoJSONPoints = () => {
  return useQuery({
    queryKey: ['points'],
    queryFn: async () => {
      const response = await fetch('/points.geojson');
      if (!response.ok) throw new Error('Failed to fetch points data');
      return response.json();
    },
    staleTime: 300000, // Cache for 5 minutes
    retry: 2,
    onError: (error) => handleFetchError(error, 'points data')
  });
};

export const useRatLocations = () => {
  return useQuery({
    queryKey: ['ratLocations'],
    queryFn: async () => {
      const response = await fetch('/api/rat-locations');
      if (!response.ok) throw new Error('Failed to fetch rat locations');
      return response.json();
    },
    staleTime: 60000, // Cache for 1 minute
    retry: 2,
    onError: (error) => handleFetchError(error, 'rat locations')
  });
};

export const useLassaFeverCases = () => {
  return useQuery({
    queryKey: ['lassaFeverCases'],
    queryFn: async () => {
      const response = await fetch('/api/cases');
      if (!response.ok) throw new Error('Failed to fetch Lassa Fever cases');
      return response.json();
    },
    staleTime: 300000, // Cache for 5 minutes
    retry: 2,
    onError: (error) => handleFetchError(error, 'Lassa Fever cases')
  });
};

export const useWeatherData = (lat, lon, layer = 'weather') => {
  return useQuery({
    queryKey: ['weatherData', lat, lon, layer],
    queryFn: async () => {
      const response = await fetch(`/api/openweather?lat=${lat}&lon=${lon}&layer=${layer}`);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      return response.json();
    },
    staleTime: 300000, // Cache for 5 minutes
    retry: 2,
    onError: (error) => handleFetchError(error, 'weather data')
  });
};

export const useTrainingProgress = () => {
  return useQuery({
    queryKey: ['trainingProgress'],
    queryFn: async () => {
      const response = await fetch('/api/training-progress');
      if (!response.ok) throw new Error('Failed to fetch training progress');
      return response.json();
    },
    staleTime: 1000, // Cache for 1 second (frequent updates needed)
    refetchInterval: 1000, // Poll every second
    retry: 1,
    onError: (error) => handleFetchError(error, 'training progress')
  });
};