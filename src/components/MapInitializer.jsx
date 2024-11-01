import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { hybridMapStyle } from '../config/mapStyle';
import { initializeLayers } from '../utils/mapLayers';
import { useToast } from './ui/use-toast';

if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
}

const MapInitializer = ({ map, mapContainer, mapState }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      toast({
        title: "Configuration Error",
        description: "Mapbox token is missing. Please check your environment variables.",
        variant: "destructive",
      });
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: hybridMapStyle,
        center: [20, 0], // Centered on Africa
        zoom: 3.5,
        pitch: 0,
        bearing: 0,
        antialias: true,
        maxZoom: 20,
        preserveDrawingBuffer: true,
        renderWorldCopies: true,
        localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
        fadeDuration: 0,
        crossSourceCollisions: true,
        pixelRatio: 2
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true
        }), 
        'top-right'
      );

      map.current.on('load', () => {
        try {
          initializeLayers(map.current);
          toast({
            title: "Map Initialized",
            description: "Map and layers loaded successfully",
          });
        } catch (error) {
          console.error('Error initializing layers:', error);
          toast({
            title: "Layer Initialization Error",
            description: "Some layers failed to load. Basic map functionality is still available.",
            variant: "warning",
          });
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your configuration.",
        variant: "destructive",
      });
    }
  }, []);

  return null;
};

export default MapInitializer;