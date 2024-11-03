import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { WeatherLayerManager } from '../utils/weatherLayerManager';
import TopNavigationBar from './TopNavigationBar';
import SidePanels from './SidePanels';
import { useToast } from './ui/use-toast';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const weatherLayerManager = useRef(null);
  const [mapState, setMapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState(['precipitation', 'temperature', 'clouds', 'wind']);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    }

    if (map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      map.current.on('load', async () => {
        // Initialize terrain
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });

        map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

        // Initialize weather layer manager
        weatherLayerManager.current = new WeatherLayerManager(
          map.current,
          import.meta.env.VITE_OPENWEATHER_API_KEY
        );
        await weatherLayerManager.current.initializeLayers();

        // Set initial layer visibility
        activeLayers.forEach(layerId => {
          weatherLayerManager.current.toggleLayer(layerId, true);
        });
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your configuration.",
        variant: "destructive",
      });
    }

    return () => map.current?.remove();
  }, []);

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      const isActive = prev.includes(layerId);
      const newLayers = isActive
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId];
      
      if (weatherLayerManager.current) {
        weatherLayerManager.current.toggleLayer(layerId, !isActive);
      }
      
      return newLayers;
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
      />

      <SidePanels
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        setLeftPanelOpen={setLeftPanelOpen}
        setRightPanelOpen={setRightPanelOpen}
        activeLayers={activeLayers}
        handleLayerToggle={handleLayerToggle}
      />
    </div>
  );
};

export default WeatherMap;