import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import BottomPanel from './BottomPanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import { initializeAerisMap, cleanupAerisMap } from '../utils/aerisMapUtils';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const aerisApp = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState([]);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [consoleLog, setConsoleLog] = useState([]);

  useEffect(() => {
    initializeAerisMap(mapContainer.current, aerisApp, mapState, toast);
    return () => cleanupAerisMap(aerisApp);
  }, []);

  useEffect(() => {
    if (!aerisApp.current) return;
    
    activeLayers.forEach(layer => {
      aerisApp.current.map.layers.setLayerOpacity(layer, layerOpacity / 100);
    });
  }, [activeLayers, layerOpacity]);

  const handleLayerToggle = (layer) => {
    setActiveLayers(prevLayers => {
      const newLayers = prevLayers.includes(layer)
        ? prevLayers.filter(l => l !== layer)
        : [...prevLayers, layer];
      if (aerisApp.current) {
        aerisApp.current.map.layers.toggleLayer(layer);
      }
      addToConsoleLog(`Layer ${layer} ${newLayers.includes(layer) ? 'activated' : 'deactivated'}`);
      return newLayers;
    });
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    addToConsoleLog(`Layer opacity changed to ${opacity}%`);
  };

  const handleSearch = async (query) => {
    addToConsoleLog(`Searching for: ${query}`);
    // Implement search functionality here
  };

  const addToConsoleLog = (message) => {
    setConsoleLog(prevLog => [...prevLog, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#0f172a] text-white">
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
      />
      <div className="flex-grow relative">
        <div ref={mapContainer} className="absolute inset-0" />
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
        <BottomPanel consoleLog={consoleLog} />
      </div>
      <FloatingInsightsBar />
      <AnimatePresence>
        {aiTrainingOpen && (
          <AITrainingInterface
            isOpen={aiTrainingOpen}
            onClose={() => setAiTrainingOpen(false)}
            addToConsoleLog={addToConsoleLog}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherMap;