import { toast } from '../components/ui/use-toast';
import { mockRatLocations, mockLassaCases } from './mockData';

export const fetchRatData = async () => {
  try {
    // First try to fetch from local files if available
    const response = await fetch('/data/mastomys_natalensis_locations.geojson');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // If local file not found, use mock data
    console.log('Using mock rat location data');
    return mockRatLocations;
  } catch (error) {
    console.log('Using mock rat location data');
    return mockRatLocations;
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    // First try to fetch from local files if available
    const response = await fetch('/data/lassa_fever_cases.geojson');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // If local file not found, use mock data
    console.log('Using mock Lassa fever cases data');
    return mockLassaCases;
  } catch (error) {
    console.log('Using mock Lassa fever cases data');
    return mockLassaCases;
  }
};

export const fetchTrainingProgress = async () => {
  return { progress: 75, is_training: false };
};

export const fetchWeatherData = async (lat, lon) => {
  return {
    temperature: 25,
    humidity: 65,
    windSpeed: 10,
    precipitation: 0
  };
};