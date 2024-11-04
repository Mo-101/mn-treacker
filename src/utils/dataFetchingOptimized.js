import { useQuery } from '@tanstack/react-query';
import { toast } from '../components/ui/use-toast';
import { API_CONFIG } from '../config/apiConfig';
import { 
  fetchMastomysLocations, 
  fetchLassaFeverCases, 
  fetchEnvironmentalData,
  fetchTrainingData,
  fetchWeatherLayers 
} from './api';

export const useGeoJSONPoints = () => {
  return useQuery({
    queryKey: ['points'],
    queryFn: fetchMastomysLocations,
    staleTime: 300000,
    retry: 2,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch location data from Terrabox",
        variant: "destructive",
      });
    }
  });
};

export const useRatLocations = () => {
  return useQuery({
    queryKey: ['ratLocations'],
    queryFn: fetchMastomysLocations,
    staleTime: 60000,
    retry: 2
  });
};

export const useLassaFeverCases = () => {
  return useQuery({
    queryKey: ['lassaFeverCases'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000,
    retry: 2
  });
};

export const useEnvironmentalData = () => {
  return useQuery({
    queryKey: ['environmentalData'],
    queryFn: fetchEnvironmentalData,
    staleTime: 300000,
    retry: 2
  });
};

export const useTrainingProgress = () => {
  return useQuery({
    queryKey: ['trainingProgress'],
    queryFn: fetchTrainingData,
    staleTime: 1000,
    refetchInterval: 1000,
    retry: 1
  });
};

export const useWeatherLayers = () => {
  return useQuery({
    queryKey: ['weatherLayers'],
    queryFn: fetchWeatherLayers,
    staleTime: 300000,
    retry: 2
  });
};