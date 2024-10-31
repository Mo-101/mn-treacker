import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from '../components/ui/use-toast';

// Set the access token globally for mapbox-gl
if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
}

export const initializeMap = (mapContainer, mapState) => {
  if (!mapboxgl.accessToken) {
    toast({
      title: "Configuration Error",
      description: "Mapbox token is missing. Please check your environment variables.",
      variant: "destructive",
    });
    throw new Error('Mapbox token is required but not provided');
  }

  const map = new mapboxgl.Map({
    container: mapContainer,
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [mapState.lng, mapState.lat],
    zoom: mapState.zoom,
    pitch: 45,
    bearing: 0
  });

  return map;
};

export const addMapControls = (map) => {
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
};