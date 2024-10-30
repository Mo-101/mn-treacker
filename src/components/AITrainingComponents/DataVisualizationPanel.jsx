import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import mapboxgl from 'mapbox-gl';
import { useToast } from '../ui/use-toast';
import 'mapbox-gl/dist/mapbox-gl.css';

// Ensure token is set globally
if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
}

const DataVisualizationPanel = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return;

    try {
      if (!mapboxgl.accessToken) {
        throw new Error('Mapbox token is required but not provided');
      }

      map.current = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [0, 0],
        zoom: 2
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map visualization. Please check your configuration.",
        variant: "destructive",
      });
    }

    return () => map.current?.remove();
  }, []);

  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Data Visualization</h2>
        <div id="map" style={{ width: '100%', height: '400px' }} />
      </CardContent>
    </Card>
  );
};

export default DataVisualizationPanel;