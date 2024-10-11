import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import MastomysTracker from './MastomysTracker';
import PredictionPanel from './PredictionPanel';
import { initializeAerisWeather, toggleAerisLayer, setAerisLayerOpacity, toggleAerisAnimation } from '../utils/aerisWeatherUtils';
import { fetchMastomysData } from '../utils/mapUtils';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const aerisMap = useRef(null);
  const [mapState, setMapState] = useState({ lng: 5.625, lat: 8.2332, zoom: 4 });
  const [activeLayers, setActiveLayers] = useState([]);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [mastomysData, setMastomysData] = useState([]);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const weatherLayers = [
    { id: 'fradar-hrrr', name: 'Radar' },
    { id: 'temperatures', name: 'Temperature' },
    { id: 'humidity-rtma', name: 'Humidity' },
    { id: 'satellite-infrared-color', name: 'Satellite' },
  ];

  useEffect(() => {
    initializeAerisWeather(
      mapContainer.current,
      mapState,
      () => {
        addToConsoleLog('AerisWeather map initialized');
        fetchMastomysData(setMastomysData, addToConsoleLog);
      },
      (error) => {
        console.error('Error initializing Aeris Weather SDK:', error);
        toast({
          title: "Error",
          description: "Failed to initialize weather map. Please try again later.",
          variant: "destructive",
        });
      }
    ).then(map => {
      aerisMap.current = map;
    });

    return () => {
      if (aerisMap.current) {
        aerisMap.current.destroy();
      }
    };
  }, []);

  const toggleLayer = (layerId) => {
    if (aerisMap.current) {
      const isVisible = !activeLayers.includes(layerId);
      toggleAerisLayer(aerisMap.current, layerId, isVisible);
      setActiveLayers(prev => 
        isVisible ? [...prev, layerId] : prev.filter(id => id !== layerId)
      );
      addToConsoleLog(`Layer ${layerId} ${isVisible ? 'enabled' : 'disabled'}`);
    }
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    activeLayers.forEach(layerId => {
      setAerisLayerOpacity(aerisMap.current, layerId, opacity);
    });
    addToConsoleLog(`Layer opacity set to ${opacity}%`);
  };

  const toggleAnimation = () => {
    if (aerisMap.current) {
      toggleAerisAnimation(aerisMap.current);
      setIsAnimating(prev => !prev);
      addToConsoleLog(`Animation ${isAnimating ? 'stopped' : 'started'}`);
    }
  };

  const addToConsoleLog = (message) => {
    toast({
      title: "Map Update",
      description: message,
    });
  };

  const handleDetailView = () => {
    setPredictionPanelOpen(false);
    // Add code to update main map view based on prediction details
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <TopNavigationBar 
            onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
            onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
            onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
          />
        </div>
        <AnimatePresence>
          {leftPanelOpen && (
            <div className="pointer-events-auto">
              <LeftSidePanel 
                isOpen={leftPanelOpen} 
                onClose={() => setLeftPanelOpen(false)}
                activeLayers={activeLayers}
                onLayerToggle={toggleLayer}
                onOpacityChange={handleOpacityChange}
                layers={weatherLayers}
              />
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {rightPanelOpen && (
            <div className="pointer-events-auto">
              <RightSidePanel 
                isOpen={rightPanelOpen} 
                onClose={() => setRightPanelOpen(false)}
                selectedPoint={selectedPoint}
              />
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {predictionPanelOpen && (
            <div className="pointer-events-auto">
              <PredictionPanel
                isOpen={predictionPanelOpen}
                onClose={() => setPredictionPanelOpen(false)}
                onDetailView={handleDetailView}
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
                addToConsoleLog={addToConsoleLog}
              />
            </div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg pointer-events-auto">
          <button onClick={toggleAnimation} className="px-4 py-2 bg-blue-500 text-white rounded">
            {isAnimating ? 'Stop' : 'Play'} Animation
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;