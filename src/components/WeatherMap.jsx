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
import LayerControls from './LayerControls';
import { initializeAerisMap, toggleAerisLayer, setAerisLayerOpacity } from '../utils/aerisWeatherApi';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const aerisMap = useRef(null);
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
    { id: 'satellite', name: 'Satellite' },
    { id: 'temperatures', name: 'Temperature' },
    { id: 'wind', name: 'Wind' },
    { id: 'precipitation', name: 'Precipitation' },
  ];

  useEffect(() => {
    if (aerisMap.current) return;
    
    const initMap = async () => {
      const result = await initializeAerisMap(mapContainer.current, mapState);
      if (result.success) {
        aerisMap.current = result.map;
        aerisMap.current.on('load', () => {
          updateMapState();
          fetchWeatherData();
          fetchMastomysData();
        });
      } else {
        console.error('Failed to initialize AerisWeather map:', result.error);
        toast({
          title: "Error",
          description: "Failed to initialize map. Please try again later.",
          variant: "destructive",
        });
      }
    };

    initMap();

    return () => {
      if (aerisMap.current) {
        aerisMap.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const fetchStreamingWeatherData = () => {
      const eventSource = new EventSource('/api/weather-data');
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setStreamingWeatherData(data);
      };
      return () => eventSource.close();
    };

    fetchStreamingWeatherData();
  }, []);

  const updateMapState = () => {
    if (!aerisMap.current) return;
    const center = aerisMap.current.getCenter();
    setMapState({
      lng: center.lon.toFixed(4),
      lat: center.lat.toFixed(4),
      zoom: aerisMap.current.getZoom().toFixed(2)
    });
  };

  const fetchWeatherData = async () => {
    // Implement weather data fetching logic here
    console.log('Fetching weather data...');
  };

  const fetchMastomysData = async () => {
    // Implement Mastomys data fetching logic here
    console.log('Fetching Mastomys data...');
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
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <TopNavigationBar 
          onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
          onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
          onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
        />
      </div>
      
      <div className="flex-grow relative overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0" id="aeris-map" />
        {aerisMap.current && (
          <MastomysTracker data={mastomysData} map={aerisMap.current} />
        )}
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto">
            <AnimatePresence>
              {leftPanelOpen && (
                <LeftSidePanel 
                  isOpen={leftPanelOpen} 
                  onClose={() => setLeftPanelOpen(false)}
                >
                  <LayerControls
                    layers={weatherLayers}
                    activeLayers={activeLayers}
                    setActiveLayers={setActiveLayers}
                    layerOpacity={layerOpacity}
                    setLayerOpacity={setLayerOpacity}
                    onLayerToggle={toggleAerisLayer}
                    onOpacityChange={setAerisLayerOpacity}
                  />
                </LeftSidePanel>
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
                  onDetailView={handleDetailView}
                />
              )}
            </AnimatePresence>
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
        </div>
      </div>
      
      <div className="flex-shrink-0">
        {streamingWeatherData && (
          <div className="bg-white p-4 shadow-lg">
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
