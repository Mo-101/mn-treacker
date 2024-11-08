import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import LeftSidePanel from './LeftSidePanel';
import MapLegend from './MapLegend';
import { addCustomLayers, toggleWeatherLayer, updateLayerOpacity } from './MapLayers';
import { hybridMapStyle } from '../config/mapStyle';
import WindGLLayer from './WindGLLayer';

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
  const [showWindParticles, setShowWindParticles] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: hybridMapStyle,
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
      });

      map.current.on('load', async () => {
        try {
          await addCustomLayers(map.current);
          toast({
            title: "Map Initialized",
            description: "Map layers loaded successfully",
          });
        } catch (error) {
          console.error('Error initializing layers:', error);
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
      const newIsActive = !isActive;

      if (toggleWeatherLayer(map.current, layerId, newIsActive)) {
        setActiveLayers(prev =>
          newIsActive 
            ? [...prev, layerId]
            : prev.filter(id => id !== layerId)
        );

        if (layerId === 'wind') {
          setShowWindParticles(newIsActive);
        }

        toast({
          title: `${layerId.charAt(0).toUpperCase() + layerId.slice(1)} Layer`,
          description: newIsActive ? "Layer enabled" : "Layer disabled",
        });
      }
    }
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    activeLayers.forEach(layerId => {
      updateLayerOpacity(map.current, layerId, opacity);
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
      
      {showWindParticles && <WindGLLayer map={map.current} />}
    </div>
  );
};

export default WeatherMap;