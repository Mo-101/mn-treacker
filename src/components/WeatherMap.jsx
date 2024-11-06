import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';

const INITIAL_CENTER = [-74.0242, 40.6941];
const INITIAL_ZOOM = 10.12;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { toast } = useToast();
  
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  useEffect(() => {
    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      toast({
        title: "Configuration Error",
        description: "Mapbox token is missing. Please check your environment variables.",
        variant: "destructive",
      });
      return;
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: center,
        zoom: zoom,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      map.current.on('move', () => {
        const mapCenter = map.current.getCenter();
        const mapZoom = map.current.getZoom();
        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
      });

      map.current.on('load', () => {
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });

        map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        map.current.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your configuration.",
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

  const handleReset = () => {
    map.current?.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM
    });
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <button 
        className="reset-button"
        onClick={handleReset}
      >
        Reset
      </button>
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default WeatherMap;