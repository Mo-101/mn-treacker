import React, { useEffect } from 'react';
import { hybridMapStyle } from '../config/mapStyle';
import { addCustomLayers } from '../utils/mapLayers';
import { useToast } from './ui/use-toast';

const MapInitializer = ({ map, mapContainer, mapState }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      toast({
        title: "Error",
        description: "Mapbox token is missing. Please check your environment variables.",
        variant: "destructive",
      });
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: hybridMapStyle,
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 0,
        antialias: true,
        maxZoom: 20,
        preserveDrawingBuffer: true
      });

      map.current.on('load', () => {
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });

        map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

        map.current.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });

        addCustomLayers(map.current);
        
        toast({
          title: "Map Initialized",
          description: "Hybrid satellite imagery and weather layers loaded successfully",
        });
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

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