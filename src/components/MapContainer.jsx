import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { customMapStyle } from '../config/customMapStyle';
import { useToast } from './ui/use-toast';

const MapContainer = ({ onMapLoad, mapState }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: customMapStyle,
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 0,
        antialias: true,
        preserveDrawingBuffer: true
      });

      map.current.on('style.load', () => {
        onMapLoad(map.current);
        toast({
          title: "Map Initialized",
          description: "Custom hybrid style loaded successfully",
        });
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your configuration.",
        variant: "destructive",
      });
    }
  }, []);

  return <div ref={mapContainer} className="absolute inset-0 w-full h-full" />;
};

export default MapContainer;