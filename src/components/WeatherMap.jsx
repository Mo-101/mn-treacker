import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
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
import { addCustomLayers } from '../utils/mapLayers';
import { initializeMap, updateMapState } from '../utils/mapUtils';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState([]);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(80);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      if (!mapboxgl.accessToken) {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      map.current.on('load', () => {
        addCustomLayers(map.current);
        toast({
          title: "Map Initialized",
          description: "Weather map layers loaded successfully",
        });
      });

      map.current.on('move', () => {
        const center = map.current.getCenter();
        setMapState({
          lng: center.lng.toFixed(4),
          lat: center.lat.toFixed(4),
          zoom: map.current.getZoom().toFixed(2)
        });
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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
    if (!map.current) return;
    
    setActiveLayers(prev => {
      const isActive = prev.includes(layerId);
      const newLayers = isActive 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId];
      
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(
          layerId,
          'visibility',
          isActive ? 'none' : 'visible'
        );
      }
      
      return newLayers;
    });
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    activeLayers.forEach(layerId => {
      if (map.current && map.current.getLayer(layerId)) {
        map.current.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
      }
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
        onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
      />

      <AnimatePresence>
        {leftPanelOpen && (
          <LeftSidePanel
            isOpen={leftPanelOpen}
            onClose={() => setLeftPanelOpen(false)}
            activeLayers={activeLayers}
            onLayerToggle={handleLayerToggle}
            onOpacityChange={handleOpacityChange}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rightPanelOpen && (
          <RightSidePanel
            isOpen={rightPanelOpen}
            onClose={() => setRightPanelOpen(false)}
            selectedPoint={selectedPoint}
          />
        )}
      </AnimatePresence>

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

      <div className="absolute bottom-4 left-4">
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
          <DetectionSpotLayer map={map.current} />
          <LassaFeverCasesLayer map={map.current} />
        </>
      )}
    </div>
  );
};

export default WeatherMap;