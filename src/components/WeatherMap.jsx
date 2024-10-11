import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import PredictionPanel from './PredictionPanel';
import AerisWeatherMap from './AerisWeatherMap';
import WeatherControls from './WeatherControls';
import StreamingWeatherData from './StreamingWeatherData';
import { initializeAerisMap, cleanupAerisMap } from '../utils/aerisMapUtils';

const WeatherMap = () => {
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState([]);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [streamingWeatherData, setStreamingWeatherData] = useState(null);
  const [predictionData, setPredictionData] = useState([]);
  const [aerisMap, setAerisMap] = useState(null);

  const addToConsoleLog = useCallback((message) => {
    console.log(message);
    toast({
      title: "Map Update",
      description: message,
    });
  }, [toast]);

  useEffect(() => {
    const map = initializeAerisMap('map-container', mapState, addToConsoleLog);
    setAerisMap(map);
    return () => cleanupAerisMap(map);
  }, [mapState, addToConsoleLog]);

  const handleLayerToggle = useCallback((layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
    );
    if (aerisMap) {
      aerisMap.layers.setLayerVisibility(layerId, !activeLayers.includes(layerId));
    }
    addToConsoleLog(`Layer ${layerId} ${activeLayers.includes(layerId) ? 'disabled' : 'enabled'}`);
  }, [activeLayers, aerisMap, addToConsoleLog]);

  const handleOpacityChange = useCallback((opacity) => {
    setLayerOpacity(opacity);
    if (aerisMap) {
      activeLayers.forEach(layerId => {
        aerisMap.layers.setLayerOpacity(layerId, opacity / 100);
      });
    }
    addToConsoleLog(`Layer opacity set to ${opacity}%`);
  }, [activeLayers, aerisMap, addToConsoleLog]);

  const handleDetailView = useCallback((highRiskArea) => {
    setPredictionPanelOpen(false);
    if (aerisMap) {
      aerisMap.panTo(highRiskArea.center);
      aerisMap.setZoom(10);
      // Implement highlighting logic for AerisWeather map
    }
    addToConsoleLog(`Highlighting high-risk area: ${highRiskArea.name}`);
  }, [aerisMap, addToConsoleLog]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div id="map-container" className="absolute inset-0" />
      <AerisWeatherMap aerisMap={aerisMap} />
      <div className="absolute inset-0 pointer-events-none">
        <TopNavigationBar 
          onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
          onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
          onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
        />
        <WeatherControls
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          layerOpacity={layerOpacity}
          onOpacityChange={handleOpacityChange}
        />
        <LeftSidePanel 
          isOpen={leftPanelOpen} 
          onClose={() => setLeftPanelOpen(false)}
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          onOpacityChange={handleOpacityChange}
        />
        <RightSidePanel 
          isOpen={rightPanelOpen} 
          onClose={() => setRightPanelOpen(false)}
          selectedPoint={selectedPoint}
        />
        <PredictionPanel
          isOpen={predictionPanelOpen}
          onClose={() => setPredictionPanelOpen(false)}
          onDetailView={handleDetailView}
          predictionData={predictionData}
        />
        <FloatingInsightsBar />
        <AITrainingInterface
          isOpen={aiTrainingOpen}
          onClose={() => setAiTrainingOpen(false)}
          addToConsoleLog={addToConsoleLog}
          updateMapData={setPredictionData}
        />
        <StreamingWeatherData data={streamingWeatherData} />
      </div>
    </div>
  );
};

export default WeatherMap;