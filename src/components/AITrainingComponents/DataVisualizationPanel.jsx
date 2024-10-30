import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import mapboxgl from 'mapbox-gl';
import { useToast } from '../ui/use-toast';
import 'mapbox-gl/dist/mapbox-gl.css';

const DataVisualizationPanel = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return;

    try {
      if (!mapboxgl.accessToken) {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [0, 0],
        zoom: 1.5,
        projection: 'globe',
        preserveDrawingBuffer: true // This helps with map rendering
      });

      map.current.on('load', () => {
        map.current.addControl(new mapboxgl.NavigationControl({
          visualizePitch: true
        }), 'top-right');

        map.current.addSource('sample-points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [0, 0]
                },
                properties: {
                  title: 'Sample Point 1',
                  value: 75
                }
              }
            ]
          }
        });

        map.current.addLayer({
          id: 'data-points',
          type: 'circle',
          source: 'sample-points',
          paint: {
            'circle-radius': 8,
            'circle-color': '#facc15',
            'circle-opacity': 0.8,
            'circle-blur': 0.5,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#facc15',
            'circle-stroke-opacity': 0.3
          }
        });

        toast({
          title: "Map Initialized",
          description: "Data visualization map loaded successfully",
          variant: "default",
        });
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
  }, [toast]);

  return (
    <Card className="bg-gray-800/50 backdrop-blur-md border-yellow-400/20">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400 tracking-tight">Data Visualization</h2>
        <div 
          ref={mapContainer} 
          className="w-full h-[400px] rounded-lg overflow-hidden border border-yellow-400/20 shadow-lg"
        />
      </CardContent>
    </Card>
  );
};

export default DataVisualizationPanel;