import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchRatData, fetchLassaFeverCases } from '../utils/api';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import PredictionPanel from './PredictionPanel';
import DetectionSpotLayer from './DetectionSpotLayer';
import LassaFeverCasesLayer from './LassaFeverCasesLayer';
import WeatherControls from './WeatherControls';
import SidePanels from './SidePanels';
import MapLegend from './MapLegend';
import WindGLLayer from './WindGLLayer';
import { toggleLayer, setLayerOpacity } from '../utils/mapLayers';
import { useToast } from './ui/use-toast';

if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
}

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState(['precipitation', 'temperature', 'clouds', 'wind']);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(80);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  const { data: ratData, isLoading: ratLoading } = useQuery({
    queryKey: ['rat-data'],
    queryFn: fetchRatData,
    staleTime: 300000,
  });

  const { data: lassaData, isLoading: lassaLoading } = useQuery({
    queryKey: ['lassa-cases'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000,
  });

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-hybrid-v9', // Changed to hybrid satellite style
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 0,
        antialias: true,
        preserveDrawingBuffer: true
      });

      map.current.on('style.load', () => {
        setMapLoaded(true);
        toast({
          title: "Map Initialized",
          description: "Map and style loaded successfully",
        });
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

      // Add terrain and sky layers after style loads
      map.current.on('style.load', () => {
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

  const handleLayerToggle = (layerId) => {
    if (map.current && mapLoaded) {
      const isActive = activeLayers.includes(layerId);
      toggleLayer(map.current, layerId, !isActive);
      setActiveLayers(prev => 
        isActive ? prev.filter(id => id !== layerId) : [...prev, layerId]
      );
    }
  };

  const handleOpacityChange = (opacity) => {
    if (map.current && mapLoaded) {
      setLayerOpacity(opacity);
      activeLayers.forEach(layerId => {
        setLayerOpacity(map.current, layerId, opacity);
      });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
        onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
      />

      {mapLoaded && (
        <>
          <SidePanels
            leftPanelOpen={leftPanelOpen}
            rightPanelOpen={rightPanelOpen}
            setLeftPanelOpen={setLeftPanelOpen}
            setRightPanelOpen={setRightPanelOpen}
            activeLayers={activeLayers}
            handleLayerToggle={handleLayerToggle}
            handleOpacityChange={handleOpacityChange}
          />

          <AnimatePresence>
            {predictionPanelOpen && (
              <PredictionPanel
                isOpen={predictionPanelOpen}
                onClose={() => setPredictionPanelOpen(false)}
              />
            )}
          </AnimatePresence>

          <FloatingInsightsBar />

          <AnimatePresence>
            {aiTrainingOpen && (
              <AITrainingInterface
                isOpen={aiTrainingOpen}
                onClose={() => setAiTrainingOpen(false)}
              />
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 z-10">
            <WeatherControls
              activeLayers={activeLayers}
              onLayerToggle={handleLayerToggle}
              layerOpacity={layerOpacity}
              onOpacityChange={handleOpacityChange}
            />
          </div>

          <MapLegend activeLayers={activeLayers} />

          {map.current && (
            <>
              <DetectionSpotLayer map={map.current} detections={ratData?.features || []} />
              <LassaFeverCasesLayer map={map.current} cases={lassaData?.features || []} />
              <WindGLLayer map={map.current} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherMap;
