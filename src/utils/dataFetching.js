import { toast } from '../components/ui/use-toast';

export const fetchRatData = async () => {
  try {
    const response = await fetch('/api/rat-locations');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Validate data structure
    if (!data || !data.features || !Array.isArray(data.features)) {
      throw new Error('Invalid data structure received');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching rat data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch rat location data. Using fallback data.",
      variant: "destructive",
    });
    // Return valid empty GeoJSON structure as fallback
    return {
      type: 'FeatureCollection',
      features: []
    };
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await fetch('/api/cases');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Validate data structure
    if (!data || !data.features || !Array.isArray(data.features)) {
      throw new Error('Invalid data structure received');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Lassa Fever cases:', error);
    toast({
      title: "Error",
      description: "Failed to fetch Lassa Fever cases. Using fallback data.",
      variant: "destructive",
    });
    return {
      type: 'FeatureCollection',
      features: []
    };
  }
};

export const fetchTrainingProgress = async () => {
  try {
    const response = await fetch('/api/training-progress');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Validate expected data structure
    if (typeof data.progress !== 'number' || typeof data.is_training !== 'boolean') {
      throw new Error('Invalid training progress data structure');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching training progress:', error);
    toast({
      title: "Error",
      description: "Failed to fetch training progress. Using default values.",
      variant: "destructive",
    });
    return { progress: 0, is_training: false };
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(`/api/weather-data?lat=${lat}&lon=${lon}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Validate weather data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid weather data structure');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch weather data. Using fallback data.",
      variant: "destructive",
    });
    return null;
  }
};