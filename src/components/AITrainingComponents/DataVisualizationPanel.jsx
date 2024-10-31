import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { hybridMapStyle } from '../../config/mapStyle';
import { useToast } from '../ui/use-toast';

// Initialize mapboxgl access token
if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
}

const DataVisualizationPanel = () => {
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
        zoom: 2,
        pitch: 45,
        bearing: 0,
        antialias: true,
        preserveDrawingBuffer: true
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        toast({
          title: "Training Visualization Ready",
          description: "Map visualization initialized successfully",
        });
      });
    } catch (error) {
      console.error('Error initializing visualization map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize visualization map",
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
    <div className="bg-black/40 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-yellow-400">Data Visualization</h3>
      <div ref={mapContainer} className="w-full h-[400px] rounded-lg overflow-hidden border border-yellow-400/20" />
    </div>
  );
};

export default DataVisualizationPanel;