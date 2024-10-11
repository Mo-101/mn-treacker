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
import { initializeAerisMap, cleanupAerisMap, toggleAerisLayer } from '../utils/aerisMapUtils';
import MastomysTracker from './MastomysTracker';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
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
  const [mastomysData, setMastomysData] = useState([]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('load', () => {
      initializeAerisMap(map.current, aerisApp, mapState, toast, addToConsoleLog);
      fetchMastomysData();
    });

    return () => {
      cleanupAerisMap(aerisApp);
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!aerisApp.current) return;
    
    activeLayers.forEach(layer => {
      toggleAerisLayer(aerisApp.current, layer, true);
      if (aerisApp.current.map && aerisApp.current.map.layers) {
        aerisApp.current.map.layers.setLayerOpacity(layer, layerOpacity / 100);
      }
    });
  }, [activeLayers, layerOpacity]);

  const handleLayerToggle = (layer) => {
    setActiveLayers(prevLayers => {
      const newLayers = prevLayers.includes(layer)
        ? prevLayers.filter(l => l !== layer)
        : [...prevLayers, layer];
      if (aerisApp.current) {
        toggleAerisLayer(aerisApp.current, layer, !prevLayers.includes(layer));
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

  const fetchMastomysData = async () => {
    // Simulated data fetch - replace with actual API call
    const simulatedData = [
      { id: 1, lat: 9.5, lng: 8.5, population: 150 },
      { id: 2, lat: 10.2, lng: 7.8, population: 200 },
      { id: 3, lat: 8.8, lng: 9.2, population: 100 },
    ];
    setMastomysData(simulatedData);
    addToConsoleLog('Mastomys natalensis data fetched');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0f172a] text-white">
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
        className="absolute top-0 left-0 right-0 z-50"
      />
      <div ref={mapContainer} className="absolute inset-0" />
      {map.current && (
        <MastomysTracker data={mastomysData} map={map.current} />
      )}
      <AnimatePresence>
        {leftPanelOpen && (
          <LeftSidePanel 
            isOpen={leftPanelOpen} 
            onClose={() => setLeftPanelOpen(false)}
            activeLayers={activeLayers}
            onLayerToggle={handleLayerToggle}
            onOpacityChange={handleOpacityChange}
            className="absolute left-0 top-16 bottom-16 z-40"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {rightPanelOpen && (
          <RightSidePanel 
            isOpen={rightPanelOpen} 
            onClose={() => setRightPanelOpen(false)}
            selectedPoint={selectedPoint}
            className="absolute right-0 top-16 bottom-16 z-40"
          />
        )}
      </AnimatePresence>
      <BottomPanel consoleLog={consoleLog} className="absolute bottom-0 left-0 right-0 z-50" />
      <FloatingInsightsBar className="absolute bottom-4 right-4 z-50" />
      <AnimatePresence>
        {aiTrainingOpen && (
          <AITrainingInterface
            isOpen={aiTrainingOpen}
            onClose={() => setAiTrainingOpen(false)}
            addToConsoleLog={addToConsoleLog}
            className="absolute inset-0 z-50"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherMap;