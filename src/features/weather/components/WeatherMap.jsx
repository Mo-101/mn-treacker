import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from "../../../components/ui/use-toast";
import LayerToggle from "../../map/components/LayerToggle";
import { defaultLayers } from '../../../utils/layerConfig';
import { motion, AnimatePresence } from 'framer-motion';

// Set Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const windCanvas = useRef(null);
  const [activeLayers, setActiveLayers] = useState(['satellite']);
  const [windOpacity, setWindOpacity] = useState(0.3);
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [0, 0],
        zoom: 2
      });

      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.opacity = windOpacity.toString();
      mapContainer.current.appendChild(canvas);
      windCanvas.current = canvas;

      const handleResize = () => {
        if (map.current && windCanvas.current) {
          const { clientWidth, clientHeight } = mapContainer.current;
          windCanvas.current.width = clientWidth;
          windCanvas.current.height = clientHeight;
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your Mapbox access token.",
        variant: "destructive",
      });
    }
  }, []);

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      if (prev.includes(layerId)) {
        return prev.filter(id => id !== layerId);
      }
      return [...prev, layerId];
    });

    if (layerId === 'wind') {
      windCanvas.current.style.display = 
        activeLayers.includes('wind') ? 'none' : 'block';
    }

    toast({
      title: `${activeLayers.includes(layerId) ? 'Disabled' : 'Enabled'} ${
        defaultLayers.find(l => l.id === layerId)?.name
      }`,
      duration: 2000,
    });
  };

  const handleReset = () => {
    setActiveLayers(['satellite']);
    setWindOpacity(0.3);
    if (windCanvas.current) {
      windCanvas.current.style.display = 'none';
    }
    toast({
      title: "Reset to default view",
      duration: 2000,
    });
  };

  const handleWindOpacityChange = (opacity) => {
    setWindOpacity(opacity);
    if (windCanvas.current) {
      windCanvas.current.style.opacity = opacity.toString();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <AnimatePresence>
        <LayerToggle
          layers={defaultLayers}
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          onReset={handleReset}
          windOpacity={windOpacity}
          onWindOpacityChange={handleWindOpacityChange}
        />
      </AnimatePresence>
    </div>
  );
};

export default WeatherMap;