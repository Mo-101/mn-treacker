import { API_CONFIG } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const handleApiError = (error, context) => {
  console.error(`Error fetching ${context}:`, error);
  toast({
    title: "Error",
    description: `Failed to fetch ${context}. Please check your connection.`,
    variant: "destructive",
  });
  return null;
};

export const fetchMastomysLocations = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.MASTOMYS_DATA);
    if (!response.ok) throw new Error('Failed to fetch Mastomys locations');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Mastomys locations');
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.LASSA_CASES);
    if (!response.ok) throw new Error('Failed to fetch Lassa fever cases');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Lassa fever cases');
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.WEATHER);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'weather layers');
  }
};

export const fetchTrainingProgress = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.TRAINING_DATA);
    if (!response.ok) throw new Error('Failed to fetch training progress');
    const data = await response.json();
    return {
      progress: data.progress || 0,
      isTraining: data.is_training || false,
      knowledgeLevel: data.knowledge_level || 0,
      activities: data.activities || [],
      timeLeft: data.time_left || 0,
      elapsedTime: data.elapsed_time || 0
    };
  } catch (error) {
    return handleApiError(error, 'training progress');
  }
};