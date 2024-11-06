import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from './ui/use-toast';

const MapInitializer = ({ map, mapContainer, mapState, onError }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        transformRequest: (url, resourceType) => {
          if (resourceType === 'Image' && url.includes('wizard-logo.png')) {
            return { url: '/placeholder.svg' };
          }
        }
      });
  
      map.current.on('load', () => {
        addWeatherLayers();
        addWindParticleLayer();
        console.log('Map loaded and layers added');
      });
  
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        toast({
          title: "Map Error",
          description: "An error occurred with the map. Some features may be limited.",
          variant: "destructive",
        });
        onError?.(e);
      });
  
      return () => map.current && map.current.remove();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your connection and try again.",
        variant: "destructive",
      });
      onError?.(error);
    }
  }, []);

  return null;
};

export default MapInitializer;