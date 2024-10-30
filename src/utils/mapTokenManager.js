import mapboxgl from 'mapbox-gl';
import { toast } from '../components/ui/use-toast';

export const initializeMapboxToken = () => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  
  if (!token) {
    toast({
      title: "Configuration Error",
      description: "Mapbox token is missing. Please check your environment variables.",
      variant: "destructive",
    });
    throw new Error('Mapbox token is required but not provided');
  }

  try {
    mapboxgl.accessToken = token;
    
    // Verify token validity by attempting to create a temporary map
    new mapboxgl.Map({
      container: document.createElement('div'),
      style: 'mapbox://styles/mapbox/dark-v10',
    });

    toast({
      title: "Map Initialized",
      description: "Mapbox token validated successfully",
    });
  } catch (error) {
    toast({
      title: "Invalid Token",
      description: "The provided Mapbox token is invalid. Please check your configuration.",
      variant: "destructive",
    });
    throw new Error('Invalid Mapbox token');
  }
};