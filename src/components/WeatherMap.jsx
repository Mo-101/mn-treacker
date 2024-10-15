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
import { addCustomLayers, toggleLayer } from './MapLayers';
import { initializeAerisMap, cleanupAerisMap } from '../utils/aerisMapUtils';
import { fetchWeatherData, fetchMastomysData } from '../utils/mapUtils';
import { getCachedWeatherData, cacheWeatherData } from '../utils/WeatherDataCache';
import { predictHabitatSuitability, monitorPredictions } from '../utils/AIPredictor';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState([]);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [mastomysData, setMastomysData] = useState([]);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [habitatPredictions, setHabitatPredictions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const aerisApp = useRef(null);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('load', () => {
      addCustomLayers(map.current);
      initializeAerisMap(mapContainer.current, aerisApp, mapState, toast, addToConsoleLog);
    });

    return () => {
      if (map.current) map.current.remove();
      cleanupAerisMap(aerisApp);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = getCachedWeatherData();
      if (cachedData) {
        setWeatherData(cachedData);
      } else {
        const fetchedData = await fetchWeatherData(map.current, mapState, addToConsoleLog);
        if (fetchedData) {
          setWeatherData(fetchedData);
          cacheWeatherData(fetchedData);
        }
      }
      await fetchMastomysData(setMastomysData, addToConsoleLog);

      // Monitor predictions and add notifications
      if (weatherData && mastomysData.length > 0) {
        const predictions = monitorPredictions(weatherData, mastomysData, addNotification);
        setHabitatPredictions(predictions);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 900000); // 15 minutes

    return () => clearInterval(interval);
  }, [mapState, weatherData, mastomysData]);

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
  };

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      const newLayers = prev.includes(layerId)
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId];
      
      toggleLayer(map.current, layerId, newLayers.includes(layerId));
      return newLayers;
    });
  };

  const handleOpacityChange = (layerId, opacity) => {
    if (map.current.getLayer(layerId)) {
      map.current.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
    }
  };

  const addToConsoleLog = (log) => {
    console.log(log);
    // Implement proper logging if needed
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
                onLayerToggle={handleLayerToggle}
                onOpacityChange={handleOpacityChange}
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
                onLayerToggle={handleLayerToggle}
                activeLayers={activeLayers}
                weatherData={weatherData}
                habitatPredictions={habitatPredictions}
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
      </div>
      <div className="absolute top-4 right-4 z-50">
        {notifications.map((notification, index) => (
          <div key={index} className={`p-2 mb-2 rounded ${notification.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'} text-white`}>
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherMap;