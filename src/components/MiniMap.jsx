import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { hybridMapStyle } from '../config/mapStyle';
import { useToast } from './ui/use-toast';

// Ensure token is set globally
if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
}

const MiniMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: hybridMapStyle,
        center: [27.12657, 3.46732],
        zoom: 1.5,
        interactive: true,
        preserveDrawingBuffer: true
      });

      map.current.on('load', () => {
        toast({
          title: "Mini Map Ready",
          description: "Prediction visualization initialized",
        });
      });
    } catch (error) {
      console.error('Error initializing mini map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize mini map",
        variant: "destructive",
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapContainer} className="w-full h-48 rounded-lg overflow-hidden border border-yellow-400/20" />
  );
};

export default MiniMap;