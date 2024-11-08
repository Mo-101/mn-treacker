import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import { weatherLayers } from '../utils/weatherLayerConfig';
import { addWeatherLayer, toggleWeatherLayer, updateLayerOpacity } from '../utils/weatherLayerManager';
import WeatherControls from './WeatherControls';

if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
}

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [activeLayers, setActiveLayers] = useState([]);
  const [layerOpacity, setLayerOpacity] = useState(70);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [0, 20],
        zoom: 2
      });

      map.current.on('load', () => {
        weatherLayers.forEach(layer => {
          addWeatherLayer(map.current, layer.id);
        });
        
        toast({
          title: "Map Initialized",
          description: "Weather layers loaded successfully",
        });
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map",
        variant: "destructive",
      });
    }
  }, []);

  const handleLayerToggle = (layerId) => {
    const isActive = activeLayers.includes(layerId);
    const success = toggleWeatherLayer(map.current, layerId, !isActive);
    
    if (success) {
      setActiveLayers(prev => 
        isActive 
          ? prev.filter(id => id !== layerId)
          : [...prev, layerId]
      );
    }
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    activeLayers.forEach(layerId => {
      updateLayerOpacity(map.current, layerId, opacity);
    });
  };

  return (
    <div className="relative w-screen h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 z-10">
        <WeatherControls
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          layerOpacity={layerOpacity}
          onOpacityChange={handleOpacityChange}
        />
      </div>
    </div>
  );
};

export default WeatherMap;