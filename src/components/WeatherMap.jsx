import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useToast } from './ui/use-toast';
import LeftSidePanel from './LeftSidePanel';
import MapLegend from './MapLegend';
import { addCustomLayers } from './MapLayers';
import { hybridMapStyle } from '../config/mapStyle';

if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
}

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState([]);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [layerOpacity, setLayerOpacity] = useState(80);
  const { toast } = useToast();

  const { data: weatherData } = useQuery({
    queryKey: ['weatherLayers'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/weather_data`);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load weather layers",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: hybridMapStyle, // Using the hybrid satellite style
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
      });

      map.current.on('load', async () => {
        try {
          await addCustomLayers(map.current);
          toast({
            title: "Success",
            description: "Map initialized successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to initialize map layers",
            variant: "destructive",
          });
        }
      });
    }
  }, []);

  const handleLayerToggle = (layerId) => {
    if (map.current) {
      const isActive = activeLayers.includes(layerId);
      setActiveLayers(prev => 
        isActive ? prev.filter(id => id !== layerId) : [...prev, layerId]
      );
      
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(
          layerId,
          'visibility',
          isActive ? 'none' : 'visible'
        );
      }
    }
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    activeLayers.forEach(layerId => {
      if (map.current && map.current.getLayer(layerId)) {
        map.current.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
      }
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <LeftSidePanel
        isOpen={leftPanelOpen}
        onClose={() => setLeftPanelOpen(false)}
        activeLayers={activeLayers}
        onLayerToggle={handleLayerToggle}
        onOpacityChange={handleOpacityChange}
      />

      <button
        onClick={() => setLeftPanelOpen(true)}
        className="absolute top-4 left-4 bg-white/10 p-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
      >
        Show Layers
      </button>

      <MapLegend activeLayers={activeLayers} />
    </div>
  );
};

export default WeatherMap;