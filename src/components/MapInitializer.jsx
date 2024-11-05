import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { hybridMapStyle } from '../config/mapStyle';
import { initializeLayers } from '../utils/mapLayers';
import { useToast } from './ui/use-toast';

const MapInitializer = ({ map, mapContainer, mapState }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: hybridMapStyle,
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      map.current.on('load', async () => {
        try {
          await initializeLayers(map.current);
          toast({
            title: "Map Initialized",
            description: "Map layers loaded successfully",
          });
        } catch (error) {
          console.error('Error initializing layers:', error);
          toast({
            title: "Warning",
            description: "Some map layers failed to load",
            variant: "destructive",
          });
        }
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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