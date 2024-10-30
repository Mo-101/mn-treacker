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
import { initializeMapboxToken } from '../utils/mapTokenManager';
import { WeatherMapContainer } from './WeatherMapContainer';

const WeatherMap = () => {
  const [mapState, setMapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState([]);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [showOpenWeather, setShowOpenWeather] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(80);
  const [detections, setDetections] = useState([
    {
      coordinates: [8, 10],
      species: 'Mastomys natalensis',
      confidence: 95,
      timestamp: new Date().toISOString(),
      details: 'Adult specimen detected',
      habitat: 'Urban environment',
      behavior: 'Foraging activity'
    }
  ]);

  useEffect(() => {
    try {
      initializeMapboxToken();
    } catch (error) {
      console.error('Failed to initialize Mapbox token:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your configuration.",
        variant: "destructive",
      });
    }
  }, []);

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId)
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <WeatherMapContainer
        mapState={mapState}
        activeLayers={activeLayers}
        layerOpacity={layerOpacity}
        detections={detections}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <TopNavigationBar 
            onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
            onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
            onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
          />
        </div>
        <SidePanels
          leftPanelOpen={leftPanelOpen}
          rightPanelOpen={rightPanelOpen}
          setLeftPanelOpen={setLeftPanelOpen}
          setRightPanelOpen={setRightPanelOpen}
          activeLayers={activeLayers}
          handleLayerToggle={handleLayerToggle}
          handleOpacityChange={handleOpacityChange}
          selectedPoint={selectedPoint}
        />
        <AnimatePresence>
          {predictionPanelOpen && (
            <div className="pointer-events-auto">
              <PredictionPanel
                isOpen={predictionPanelOpen}
                onClose={() => setPredictionPanelOpen(false)}
              />
            </div>
          )}
        </AnimatePresence>
        <div className="pointer-events-auto">
          <FloatingInsightsBar />
        </div>
        <AnimatePresence>
          {aiTrainingOpen && (
            <div className="pointer-events-auto">
              <AITrainingInterface
                isOpen={aiTrainingOpen}
                onClose={() => setAiTrainingOpen(false)}
                addToConsoleLog={(log) => console.log(log)}
              />
            </div>
          )}
        </AnimatePresence>
        <div className="pointer-events-auto absolute bottom-4 left-4">
          <WeatherControls
            activeLayers={activeLayers}
            onLayerToggle={handleLayerToggle}
            layerOpacity={layerOpacity}
            onOpacityChange={handleOpacityChange}
          />
        </div>
        <MapLegend activeLayers={activeLayers} />
      </div>
    </div>
  );
};

export default WeatherMap;