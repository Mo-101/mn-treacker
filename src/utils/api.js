import axios from 'axios';
import { toast } from '../components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    toast({
      title: "API Error",
      description: error.response?.data?.message || "An error occurred while fetching data",
      variant: "destructive",
    });
    return Promise.reject(error);
  }
);

export const fetchEnvironmentalData = async (timeframe = 'weekly') => {
  try {
    const response = await api.get(`/environmental-data?timeframe=${timeframe}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching environmental data:', error);
    // Return null instead of sample data
    return null;
  }
};

export const fetchRatData = async () => {
  try {
    const response = await api.get('/rat-locations');
    return response.data;
  } catch (error) {
    console.error('Error fetching rat data:', error);
    return {
      type: 'FeatureCollection',
      features: []
    };
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const response = await api.get('/cases');
    return response.data;
  } catch (error) {
    console.error('Error fetching Lassa fever cases:', error);
    return {
      type: 'FeatureCollection',
      features: []
    };
  }
};