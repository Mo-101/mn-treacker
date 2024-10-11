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
import { initializeAerisMap, cleanupAerisMap, toggleAerisLayer, setAerisLayerOpacity } from '../utils/aerisMapUtils';

const WeatherMap = () => {
  const [mapState, setMapState] = useState({ lng: 12.12890625, lat: 1.2303741774326145, zoom: 3 });
  const [activeLayers, setActiveLayers] = useState(['blue-marble', 'radar-global', 'fradar', 'satellite-geocolor', 'satellite-infrared-color', 'satellite-water-vapor', 'rivers', 'roads', 'admin', 'admin-dk']);
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
    const initMap = async () => {
      try {
        const map = await initializeAerisMap('map-container', mapState, addToConsoleLog);
        setAerisMap(map);
      } catch (error) {
        console.error('Failed to initialize AerisWeather map:', error);
        addToConsoleLog('Failed to initialize weather map');
      }
    };
    initMap();
    return () => {
      if (aerisMap) {
        cleanupAerisMap(aerisMap);
      }
    };
  }, [mapState, addToConsoleLog]);

  const handleLayerToggle = useCallback((layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
    );
    if (aerisMap) {
      toggleAerisLayer(aerisMap, layerId, !activeLayers.includes(layerId));
    }
    addToConsoleLog(`Layer ${layerId} ${activeLayers.includes(layerId) ? 'disabled' : 'enabled'}`);
  }, [activeLayers, aerisMap, addToConsoleLog]);

  const handleOpacityChange = useCallback((opacity) => {
    setLayerOpacity(opacity);
    if (aerisMap) {
      activeLayers.forEach(layerId => {
        setAerisLayerOpacity(aerisMap, layerId, opacity);
      });
    }
    addToConsoleLog(`Layer opacity set to ${opacity}%`);
  }, [activeLayers, aerisMap, addToConsoleLog]);

  const handleDetailView = useCallback((highRiskArea) => {
    setPredictionPanelOpen(false);
    if (aerisMap) {
      aerisMap.panTo(highRiskArea.center);
      aerisMap.setZoom(10);
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
          layers={[
            { id: 'blue-marble', name: 'Blue Marble' },
            { id: 'radar-global', name: 'Global Radar' },
            { id: 'fradar', name: 'Future Radar' },
            { id: 'satellite-geocolor', name: 'Satellite Geocolor' },
            { id: 'satellite-infrared-color', name: 'Satellite Infrared' },
            { id: 'satellite-water-vapor', name: 'Satellite Water Vapor' },
            { id: 'rivers', name: 'Rivers' },
            { id: 'roads', name: 'Roads' },
            { id: 'admin', name: 'Admin Boundaries' },
            { id: 'admin-dk', name: 'Admin Boundaries (Dark)' }
          ]}
          aerisMap={aerisMap}
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