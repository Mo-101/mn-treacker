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
import AerisWeather from '@aerisweather/javascript-sdk';
import { addCustomLayers, toggleLayer } from './MapLayers';
import { initializeAerisMap, cleanupAerisMap } from '../utils/aerisMapUtils';
import { fetchWeatherData, fetchMastomysData } from '../utils/mapUtils';
import { getCachedWeatherData, cacheWeatherData } from '../utils/WeatherDataCache';
import { predictHabitatSuitability } from '../utils/AIPredictor';

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
        const data = await fetchWeatherData(map.current, mapState, addToConsoleLog);
        setWeatherData(data);
        cacheWeatherData(data);
      }
      const mastomysData = await fetchMastomysData(setMastomysData, addToConsoleLog);
      setMastomysData(mastomysData);
    };

    fetchData();
    const interval = setInterval(fetchData, 900000); // 15 minutes

    return () => clearInterval(interval);
  }, [mapState]);

  useEffect(() => {
    if (weatherData && mastomysData.length > 0) {
      const predictions = predictHabitatSuitability(weatherData, mastomysData);
      setHabitatPredictions(predictions);
    }
  }, [weatherData, mastomysData]);

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
    </div>
  );
};

export default WeatherMap;