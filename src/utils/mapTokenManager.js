import mapboxgl from 'mapbox-gl';
import { toast } from '../components/ui/use-toast';

export const initializeMapboxToken = () => {
  if (!import.meta.env.VITE_MAPBOX_TOKEN) {
    toast({
      title: "Configuration Error",
      description: "Mapbox token is missing. Please check your environment variables.",
      variant: "destructive",
    });
    throw new Error('Mapbox token is required but not provided');
  }

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
};