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
import MastomysTracker from './MastomysTracker';
import Prediction from './Prediction';
import { initializeMap, handleLayerToggle, handleOpacityChange, fetchWeatherData, fetchMastomysData } from '../utils/mapUtils';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState([]);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [mastomysData, setMastomysData] = useState([]);
  const [showPrediction, setShowPrediction] = useState(false);

  useEffect(() => {
    if (map.current) return;
    initializeMap(mapContainer, map, mapState, setMapState, addCustomLayers, updateMapState, toast);
  }, []);

  useEffect(() => {
    if (map.current) {
      fetchWeatherData(map.current, mapState, addToConsoleLog);
      fetchMastomysData(setMastomysData, addToConsoleLog);
    }
  }, [mapState]);

  const addCustomLayers = (map) => {
    // Add custom layers here, but set them to invisible by default
  };

  const updateMapState = () => {
    if (!map.current) return;
    const center = map.current.getCenter();
    setMapState({
      lng: center.lng.toFixed(4),
      lat: center.lat.toFixed(4),
      zoom: map.current.getZoom().toFixed(2)
    });
  };

  const addToConsoleLog = (message) => {
    toast({
      title: "Map Update",
      description: message,
    });
  };

  const handleLayerToggle = (layerId) => {
    if (map.current) {
      const visibility = map.current.getLayoutProperty(layerId, 'visibility');
      map.current.setLayoutProperty(
        layerId,
        'visibility',
        visibility === 'visible' ? 'none' : 'visible'
      );
      setActiveLayers(prev => 
        visibility === 'visible' 
          ? prev.filter(id => id !== layerId)
          : [...prev, layerId]
      );
      addToConsoleLog(`Layer ${layerId} ${visibility !== 'visible' ? 'enabled' : 'disabled'}`);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 z-0" />
      {map.current && (
        <MastomysTracker data={mastomysData} map={map.current} />
      )}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <TopNavigationBar 
          onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
          onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
          onPredictionToggle={() => setShowPrediction(!showPrediction)}
          className="pointer-events-auto"
        />
        <AnimatePresence>
          {leftPanelOpen && (
            <LeftSidePanel 
              isOpen={leftPanelOpen} 
              onClose={() => setLeftPanelOpen(false)}
              activeLayers={activeLayers}
              onLayerToggle={handleLayerToggle}
              onOpacityChange={(opacity) => handleOpacityChange(opacity, map.current, activeLayers, setLayerOpacity, addToConsoleLog)}
              className="pointer-events-auto"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {rightPanelOpen && (
            <RightSidePanel 
              isOpen={rightPanelOpen} 
              onClose={() => setRightPanelOpen(false)}
              selectedPoint={selectedPoint}
              className="pointer-events-auto"
            />
          )}
        </AnimatePresence>
        <FloatingInsightsBar className="pointer-events-auto" />
        <AnimatePresence>
          {aiTrainingOpen && (
            <AITrainingInterface
              isOpen={aiTrainingOpen}
              onClose={() => setAiTrainingOpen(false)}
              addToConsoleLog={addToConsoleLog}
              className="pointer-events-auto"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showPrediction && (
            <Prediction />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WeatherMap;