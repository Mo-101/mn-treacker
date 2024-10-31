import axios from 'axios';
import { toast } from '../components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/environmental-data?timeframe=${timeframe}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching environmental data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch environmental data. Using sample data.",
      variant: "destructive",
    });
    // Return sample data as fallback
    return {
      populationTrend: [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
      ],
      habitatSuitability: [
        { area: 'Forest', suitability: 80 },
        { area: 'Grassland', suitability: 65 },
        { area: 'Urban', suitability: 30 },
        { area: 'Wetland', suitability: 75 },
      ]
    };
  }
};

export const fetchRatData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rat-locations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rat data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch rat data. Using sample data.",
      variant: "destructive",
    });
    // Return sample data as fallback
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [3.3792, 6.5244]
          },
          properties: {
            id: 1,
            confidence: 0.85,
            timestamp: new Date().toISOString()
          }
        }
      ]
    };
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cases`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Lassa fever cases:', error);
    toast({
      title: "Error",
      description: "Failed to fetch Lassa fever cases. Using sample data.",
      variant: "destructive",
    });
    // Return sample data as fallback
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [3.3792, 6.5244]
          },
          properties: {
            id: 1,
            severity: 'high',
            date: new Date().toISOString()
          }
        }
      ]
    };
  }
};