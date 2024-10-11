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
import MastomysTracker from './MastomysTracker';
import Prediction from './Prediction';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState(['weather', 'satellite', 'temperatures', 'wind', 'precipitation']);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [consoleLog, setConsoleLog] = useState([]);
  const [mastomysData, setMastomysData] = useState([]);
  const [showPrediction, setShowPrediction] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('load', () => {
      fetchWeatherData();
      fetchMastomysData();
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${mapState.lat}&lon=${mapState.lng}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`);
      const data = await response.json();
      
      if (map.current) {
        // Add weather data as a new source
        map.current.addSource('weather', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [data.coord.lon, data.coord.lat]
            },
            properties: {
              temperature: data.main.temp,
              description: data.weather[0].description
            }
          }
        });

        // Add a layer to display the weather data
        map.current.addLayer({
          id: 'weather',
          type: 'symbol',
          source: 'weather',
          layout: {
            'text-field': ['concat', ['to-string', ['get', 'temperature']], '°C\n', ['get', 'description']],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12
          },
          paint: {
            'text-color': '#ffffff'
          }
        });

        addToConsoleLog('Weather data fetched and added to map');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      addToConsoleLog('Failed to fetch weather data');
    }
  };

  const handleLayerToggle = (layer) => {
    setActiveLayers(prevLayers => {
      const newLayers = prevLayers.includes(layer)
        ? prevLayers.filter(l => l !== layer)
        : [...prevLayers, layer];
      if (map.current && map.current.getLayer(layer)) {
        map.current.setLayoutProperty(layer, 'visibility', newLayers.includes(layer) ? 'visible' : 'none');
      }
      addToConsoleLog(`Layer ${layer} ${newLayers.includes(layer) ? 'activated' : 'deactivated'}`);
      return newLayers;
    });
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    activeLayers.forEach(layer => {
      if (map.current && map.current.getLayer(layer)) {
        map.current.setPaintProperty(layer, 'raster-opacity', opacity / 100);
      }
    });
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
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {map.current && (
        <MastomysTracker data={mastomysData} map={map.current} />
      )}
      <div className="absolute inset-0 pointer-events-none">
        <TopNavigationBar 
          onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
          onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
          onPredictionToggle={() => setShowPrediction(!showPrediction)}
          className="pointer-events-auto"
        />
        <AnimatePresence>
          {leftPanelOpen && (
            <LeftSidePanel 
              isOpen={leftPanelOpen} 
              onClose={() => setLeftPanelOpen(false)}
              activeLayers={activeLayers}
              onLayerToggle={handleLayerToggle}
              onOpacityChange={handleOpacityChange}
              className="pointer-events-auto"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {rightPanelOpen && (
            <RightSidePanel 
              isOpen={rightPanelOpen} 
              onClose={() => setRightPanelOpen(false)}
              selectedPoint={selectedPoint}
              className="pointer-events-auto"
            />
          )}
        </AnimatePresence>
        <BottomPanel consoleLog={consoleLog} className="pointer-events-auto" />
        <FloatingInsightsBar className="pointer-events-auto" />
        <AnimatePresence>
          {aiTrainingOpen && (
            <AITrainingInterface
              isOpen={aiTrainingOpen}
              onClose={() => setAiTrainingOpen(false)}
              addToConsoleLog={addToConsoleLog}
              className="pointer-events-auto"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showPrediction && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute inset-x-0 bottom-0 z-50 pointer-events-auto"
            >
              <Prediction />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WeatherMap;