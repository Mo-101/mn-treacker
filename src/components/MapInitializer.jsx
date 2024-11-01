import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
        pitch: 45,
        bearing: 0,
        antialias: true,
        maxZoom: 20,
        preserveDrawingBuffer: true,
        renderWorldCopies: true,
        localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
        fadeDuration: 0,
        crossSourceCollisions: true,
        pixelRatio: window.devicePixelRatio > 1 ? 2 : 1, // Enhanced for 4K displays
        maxTileCacheSize: 100, // Increased tile cache for better quality
        transformRequest: (url, resourceType) => {
          if (resourceType === 'Tile' && url.includes('satellite')) {
            // Request high-resolution satellite imagery
            return {
              url: url.replace('{ratio}', window.devicePixelRatio > 1 ? '@2x' : '')
            };
          }
        }
      });

      // Add terrain with increased exaggeration
      map.current.on('load', () => {
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });

        map.current.setTerrain({ 
          source: 'mapbox-dem', 
          exaggeration: 4.0 // Increased terrain exaggeration
        });

        map.current.setFog({
          'horizon-blend': 0.3,
          'color': '#f8f8f8',
          'high-color': '#add8e6',
          'space-color': '#d8f2ff',
          'star-intensity': 0.0
        });

        try {
          initializeLayers(map.current);
          toast({
            title: "Map Initialized",
            description: "High-resolution map and layers loaded successfully",
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

      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true
        }), 
        'top-right'
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