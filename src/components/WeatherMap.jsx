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
import WeatherLayerControls from './WeatherLayerControls';
import SidePanels from './SidePanels';
import { fetchRatLocations, fetchLassaFeverCases, fetchWeatherData } from '../utils/api';
import { initializeMap, addWeatherLayers, addOpenWeatherLayer, toggleLayer } from '../utils/mapUtils';

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
  const [showOpenWeather, setShowOpenWeather] = useState(false);

  useEffect(() => {
    if (map.current) return;
    map.current = initializeMap(mapContainer.current, mapState);

    map.current.on('load', () => {
      addWeatherLayers(map.current);
      fetchLassaFeverCasesData();
      addOpenWeatherLayer(map.current);
      console.log('Map loaded and layers added');
    });

    return () => map.current && map.current.remove();
  }, []);

  const fetchLassaFeverCasesData = async () => {
    try {
      const data = await fetchLassaFeverCases();
      addLassaFeverLayer(data);
    } catch (error) {
      console.error('Error fetching Lassa Fever cases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch Lassa Fever cases. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const addLassaFeverLayer = (data) => {
    if (!map.current.getSource('lassa-fever-cases')) {
      map.current.addSource('lassa-fever-cases', {
        type: 'geojson',
        data: data
      });

      map.current.addLayer({
        id: 'lassa-fever-points',
        type: 'circle',
        source: 'lassa-fever-cases',
        paint: {
          'circle-radius': 6,
          'circle-color': '#FF0000',
          'circle-opacity': 0.7
        }
      });
    }
  };

  const handleLayerToggle = (layerId) => {
    toggleLayer(map.current, layerId, !activeLayers.includes(layerId));
    setActiveLayers(prev => 
      prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
    );
  };

  const handleSelectAllLayers = () => {
    const allLayers = ['precipitation', 'temp', 'clouds', 'wind'];
    const newActiveLayers = activeLayers.length === allLayers.length ? [] : allLayers;
    
    allLayers.forEach(layer => {
      toggleLayer(map.current, layer, newActiveLayers.includes(layer));
    });

    setActiveLayers(newActiveLayers);
  };

  const handleOpacityChange = (layerId, opacity) => {
    if (map.current && map.current.getLayer(layerId)) {
      map.current.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
    }
  };

  const handleDetailView = () => {
    console.log('Detail view requested');
    setPredictionPanelOpen(false);
  };

  const toggleOpenWeatherLayer = () => {
    const visibility = !showOpenWeather;
    toggleLayer(map.current, 'openWeatherTemperatureLayer', visibility);
    setShowOpenWeather(visibility);
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
        <SidePanels
          leftPanelOpen={leftPanelOpen}
          rightPanelOpen={rightPanelOpen}
          setLeftPanelOpen={setLeftPanelOpen}
          setRightPanelOpen={setRightPanelOpen}
          activeLayers={activeLayers}
          handleLayerToggle={handleLayerToggle}
          handleOpacityChange={handleOpacityChange}
          handleSelectAllLayers={handleSelectAllLayers}
          selectedPoint={selectedPoint}
        />
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
                addToConsoleLog={(log) => console.log(log)}
              />
            </div>
          )}
        </AnimatePresence>
        <div className="pointer-events-auto absolute bottom-4 left-4">
          <WeatherLayerControls
            showOpenWeather={showOpenWeather}
            toggleOpenWeatherLayer={toggleOpenWeatherLayer}
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;