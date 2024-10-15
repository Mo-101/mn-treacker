import { toast } from '../components/ui/use-toast';

export const fetchRatData = async () => {
  try {
    const response = await fetch('/api/rat-data');
    if (!response.ok) {
      throw new Error('Failed to fetch rat data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rat data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch rat data. Please try again later.",
      variant: "destructive",
    });
    return { detections: [], predictions: [] };
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch('/api/cases');
    if (!response.ok) {
      throw new Error('Failed to fetch Lassa Fever cases');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Lassa Fever cases:', error);
    toast({
      title: "Error",
      description: "Failed to fetch Lassa Fever cases. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchTrainingProgress = async () => {
  try {
    const response = await fetch('/api/training-progress');
    if (!response.ok) {
      throw new Error('Failed to fetch training progress');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching training progress:', error);
    return { progress: 0, is_training: false };
  }
};