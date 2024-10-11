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
import PredictionPanel from './PredictionPanel';
import { initializeMap, handleLayerToggle, handleOpacityChange, fetchWeatherData, fetchMastomysData, updatePredictionLayer } from '../utils/mapUtils';
import AerisWeather from '@aerisweather/javascript-sdk';

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
  const [mastomysData, setMastomysData] = useState([]);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [streamingWeatherData, setStreamingWeatherData] = useState(null);

  const weatherLayers = [
    { id: 'radar', name: 'Radar' },
    { id: 'temperatures', name: 'Temperature' },
    { id: 'precipitation', name: 'Precipitation' },
    { id: 'wind-particles', name: 'Wind' },
  ];

  useEffect(() => {
    if (map.current) return;
    initializeMap(mapContainer, map, mapState, setMapState, addCustomLayers, updateMapState, toast);

    return () => {
      if (map.current) map.current.remove();
      if (aerisApp.current) aerisApp.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      fetchWeatherData(map.current, mapState, addToConsoleLog);
      fetchMastomysData(setMastomysData, addToConsoleLog);
    }
  }, [mapState]);

  useEffect(() => {
    const aeris = new AerisWeather(import.meta.env.VITE_XWEATHER_ID, import.meta.env.VITE_XWEATHER_SECRET);
    aeris.apps().then((apps) => {
      aerisApp.current = new apps.InteractiveMapApp(mapContainer.current, {
        map: {
          strategy: 'mapbox',
          zoom: mapState.zoom,
          center: {
            lat: mapState.lat,
            lon: mapState.lng
          }
        },
        layers: {
          radar: { zIndex: 1 },
          temperatures: { zIndex: 2 },
          precipitation: { zIndex: 3 },
          'wind-particles': { zIndex: 4 }
        },
        timeline: {
          from: -7200,
          to: 0
        }
      });

      aerisApp.current.on('ready', () => {
        addToConsoleLog('AerisWeather map initialized');
      });
    }).catch(error => {
      console.error('Error initializing Aeris Weather SDK:', error);
      toast({
        title: "Error",
        description: "Failed to initialize weather map. Please try again later.",
        variant: "destructive",
      });
    });
  }, []);

  const addCustomLayers = (map) => {
    // This function is no longer needed as AerisWeather handles the layers
  };

  const toggleLayer = (layerId) => {
    if (aerisApp.current) {
      const isVisible = aerisApp.current.map.layers.getLayerVisibility(layerId);
      aerisApp.current.map.layers.setLayerVisibility(layerId, !isVisible);
      setActiveLayers(prev => 
        isVisible ? prev.filter(id => id !== layerId) : [...prev, layerId]
      );
      addToConsoleLog(`Layer ${layerId} ${!isVisible ? 'enabled' : 'disabled'}`);
    }
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

  const handleDetailView = () => {
    setPredictionPanelOpen(false);
    // Add code to update main map view based on prediction details
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {map.current && (
        <MastomysTracker data={mastomysData} map={map.current} />
      )}
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
                onOpacityChange={(opacity) => handleOpacityChange(opacity, aerisApp.current, activeLayers, setLayerOpacity, addToConsoleLog)}
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
        {streamingWeatherData && (
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Live Weather Data</h3>
            <p>Temperature: {streamingWeatherData.temperature}°C</p>
            <p>Humidity: {streamingWeatherData.humidity}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherMap;