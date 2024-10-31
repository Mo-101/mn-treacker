import axios from 'axios';
import { toast } from '../components/ui/use-toast';

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API Endpoints
const ENDPOINTS = {
  UPLOAD_DATASET: `${API_BASE_URL}/upload-dataset`,
  TRAINING_PROGRESS: `${API_BASE_URL}/training-progress`,
  RAT_LOCATIONS: `${API_BASE_URL}/rat-locations`,
  CASES: `${API_BASE_URL}/cases`,
  WEATHER_DATA: `${API_BASE_URL}/weather-data`,
} as const;

// Type definitions for API responses
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

interface GeoJSONResponse {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'Point';
      coordinates: [number, number];
    };
    properties: Record<string, any>;
  }>;
}

// API Functions
export const uploadDataset = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(ENDPOINTS.UPLOAD_DATASET, formData, {
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

export const fetchTrainingProgress = async (): Promise<TrainingProgress> => {
  try {
    const response = await axios.get(ENDPOINTS.TRAINING_PROGRESS);
    return response.data;
  } catch (error) {
    console.error('Error fetching training progress:', error);
    toast({
      title: "Error",
      description: "Failed to fetch training progress.",
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchRatLocations = async (): Promise<GeoJSONResponse> => {
  try {
    const response = await axios.get(ENDPOINTS.RAT_LOCATIONS);
    return response.data;
  } catch (error) {
    console.error('Error fetching rat locations:', error);
    toast({
      title: "Error",
      description: "Failed to fetch rat locations.",
      variant: "destructive",
    });
    return { type: 'FeatureCollection', features: [] };
  }
};

export const fetchLassaFeverCases = async (): Promise<GeoJSONResponse> => {
  try {
    const response = await axios.get(ENDPOINTS.CASES);
    return response.data;
  } catch (error) {
    console.error('Error fetching Lassa fever cases:', error);
    toast({
      title: "Error",
      description: "Failed to fetch Lassa fever cases.",
      variant: "destructive",
    });
    return { type: 'FeatureCollection', features: [] };
  }
};

export const fetchWeatherData = async (lat: number, lon: number): Promise<any> => {
  try {
    const response = await axios.get(
      `${ENDPOINTS.WEATHER_DATA}?lat=${lat}&lon=${lon}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch weather data.",
      variant: "destructive",
    });
    throw error;
  }
};

// Custom hook for polling training progress
export const useTrainingProgress = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['trainingProgress'],
    queryFn: fetchTrainingProgress,
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: false,
  });

  return {
    progress: data?.progress ?? 0,
    isTraining: data?.is_training ?? false,
    metrics: data?.metrics ?? {},
    error,
    isLoading,
  };
};