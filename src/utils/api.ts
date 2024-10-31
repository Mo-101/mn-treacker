import axios from 'axios';
import { toast } from '../components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Type definitions
interface TrainingProgress {
  progress: number;
  is_training: boolean;
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1?: number;
  };
}

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: Record<string, any>;
}

interface GeoJSONResponse {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// Upload dataset function
export const uploadDataset = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/upload-dataset`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      toast({
        title: "Upload Successful",
        description: response.data.message,
      });
    }
  } catch (error) {
    console.error('Upload Error:', error);
    toast({
      title: "Upload Failed",
      description: "There was an error uploading the dataset.",
      variant: "destructive",
    });
    throw error;
  }
};

// Custom hooks for data fetching using React Query
export const useTrainingProgress = () => {
  return useQuery({
    queryKey: ['trainingProgress'],
    queryFn: async (): Promise<TrainingProgress> => {
      const response = await axios.get(`${API_BASE_URL}/training-progress`);
      return response.data;
    },
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: false,
  });
};

export const useRatLocations = () => {
  return useQuery({
    queryKey: ['ratLocations'],
    queryFn: async (): Promise<GeoJSONResponse> => {
      const response = await axios.get(`${API_BASE_URL}/rat-locations`);
      return response.data;
    },
    staleTime: 60000, // Consider data fresh for 1 minute
  });
};

export const useLassaFeverCases = () => {
  return useQuery({
    queryKey: ['lassaFeverCases'],
    queryFn: async (): Promise<GeoJSONResponse> => {
      const response = await axios.get(`${API_BASE_URL}/cases`);
      return response.data;
    },
    staleTime: 300000, // Consider data fresh for 5 minutes
  });
};

export const useWeatherData = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ['weatherData', lat, lon],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/weather-data?lat=${lat}&lon=${lon}`
      );
      return response.data;
    },
    staleTime: 300000, // Consider data fresh for 5 minutes
  });
};