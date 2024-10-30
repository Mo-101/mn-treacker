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
        center: [20, 0], // Centered on Africa
        zoom: 3.5,
        pitch: 0, // Removed pitch for better visibility
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

      map.current.on('load', () => {
        // Add HD terrain source
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.terrain-rgb',  // Changed to HD terrain source
          tileSize: 512,
          maxzoom: 14
        });

        map.current.setTerrain({ 
          source: 'mapbox-dem', 
          exaggeration: 3.1,
          quality: 'high'
        });

        // Add hillshade layer for enhanced terrain visualization
        map.current.addSource('hillshade', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.terrain-rgb',
          tileSize: 512,
          maxzoom: 14
        });

        map.current.addLayer({
          id: 'hillshading',
          type: 'hillshade',
          source: 'hillshade',
          layout: { visibility: 'visible' },
          paint: {
            'hillshade-shadow-color': '#000000',
            'hillshade-highlight-color': '#FFFFFF',
            'hillshade-accent-color': '#000000',
            'hillshade-illumination-anchor': 'viewport'
          }
        }, 'satellite');  // Add hillshade under satellite layer

        // Enhanced sky layer
        map.current.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15,
            'sky-atmosphere-halo-color': 'rgba(255, 255, 255, 0.5)',
            'sky-atmosphere-color': 'rgba(186, 210, 235, 1)',
            'sky-gradient-center': [0, 0],
            'sky-gradient-radius': 90,
            'sky-gradient': [
              'interpolate',
              ['linear'],
              ['sky-radial-progress'],
              0.8,
              'rgba(135, 206, 235, 1)',
              1,
              'rgba(255, 255, 255, 0.1)'
            ],
            'sky-opacity': [
              'interpolate',
              ['exponential', 0.1],
              ['zoom'],
              5,
              0,
              22,
              1
            ]
          }
        });

        // Initialize all other layers
        initializeLayers(map.current);

        toast({
          title: "Map Initialized",
          description: "HD terrain and layers initialized successfully",
        });
      });

      // Enhanced navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true
        }), 
        'top-right'
      );
      
      map.current.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 150,
          unit: 'metric'
        }), 
        'bottom-left'
      );

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