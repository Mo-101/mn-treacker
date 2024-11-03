import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { hybridMapStyle } from '../config/mapStyle';
import { initializeLayers } from '../utils/mapLayers';
import { fetchWeatherLayers } from '../utils/api';
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
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      map.current.on('load', async () => {
        // Add terrain source with higher exaggeration
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.terrain-rgb',
          tileSize: 512,
          maxzoom: 14
        });

        // Set terrain with higher exaggeration
        map.current.setTerrain({ 
          source: 'mapbox-dem', 
          exaggeration: 2.5 // Increased from 1.5 to make terrain more visible
        });

        // Add enhanced fog effect
        map.current.setFog({
          'range': [0.5, 10],
          'color': '#ffffff',
          'horizon-blend': 0.2,
          'high-color': '#add8e6',
          'space-color': '#d8f2ff',
          'star-intensity': 0.15
        });

        // Fetch and initialize weather layers with adjusted height
        const weatherLayers = await fetchWeatherLayers();
        if (weatherLayers) {
          weatherLayers.forEach(layer => {
            if (!map.current.getSource(layer.id)) {
              map.current.addSource(layer.id, {
                type: 'raster',
                tiles: [layer.url],
                tileSize: 256
              });
              
              // Add layer with adjusted height for clouds
              map.current.addLayer({
                id: layer.id,
                type: 'raster',
                source: layer.id,
                paint: { 
                  'raster-opacity': 0.7,
                  'raster-opacity-transition': {
                    duration: 0
                  }
                },
                layout: {
                  'visibility': 'visible'
                }
              });

              // If this is the clouds layer, add it at a higher elevation
              if (layer.id === 'clouds') {
                map.current.setLayerZoomRange(layer.id, 0, 22);
                map.current.setPaintProperty(layer.id, 'raster-fade-duration', 0);
                map.current.setPaintProperty(layer.id, 'raster-height', 5000); // Raise clouds higher
              }
            }
          });
        }

        // Initialize other layers
        initializeLayers(map.current);

        toast({
          title: "Map Initialized",
          description: "Weather layers and terrain loaded successfully.",
        });
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