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

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
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
  const [predictionData, setPredictionData] = useState([]);

  useEffect(() => {
    if (map.current) return;
    initializeMap(mapContainer, map, mapState, setMapState, addCustomLayers, updateMapState, toast);

    return () => map.current && map.current.remove();
  }, []);

  useEffect(() => {
    if (map.current) {
      fetchWeatherData(map.current, mapState, addToConsoleLog);
      fetchMastomysData(setMastomysData, addToConsoleLog);
    }
  }, [mapState]);

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

  const addCustomLayers = (map) => {
    // Implementation of addCustomLayers
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

  const handleDetailView = (highRiskArea) => {
    setPredictionPanelOpen(false);
    if (map.current) {
      map.current.flyTo({
        center: [0, 0], // Replace with actual coordinates of the high-risk area
        zoom: 10,
        essential: true
      });

      map.current.addLayer({
        id: 'highlight-layer',
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[]] // Replace with actual polygon coordinates of the high-risk area
            }
          }
        },
        paint: {
          'fill-color': '#FF0000',
          'fill-opacity': 0.5
        }
      });
    }
    addToConsoleLog(`Highlighting high-risk area: ${highRiskArea}`);
  };

  const updateMapData = (newData) => {
    if (map.current) {
      updatePredictionLayer(map.current, newData);
      setPredictionData(newData);
      addToConsoleLog('Map updated with new prediction data');
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {map.current && (
        <MastomysTracker data={mastomysData} map={map.current} />
      )}
      <div className="absolute inset-0 pointer-events-none">
        <TopNavigationBar 
          onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
          onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
          onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
        />
        <AnimatePresence>
          {leftPanelOpen && (
            <LeftSidePanel 
              isOpen={leftPanelOpen} 
              onClose={() => setLeftPanelOpen(false)}
              activeLayers={activeLayers}
              onLayerToggle={(layerId) => handleLayerToggle(layerId, map.current, setActiveLayers, addToConsoleLog)}
              onOpacityChange={(opacity) => handleOpacityChange(opacity, map.current, activeLayers, setLayerOpacity, addToConsoleLog)}
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
        <AnimatePresence>
          {predictionPanelOpen && (
            <PredictionPanel
              isOpen={predictionPanelOpen}
              onClose={() => setPredictionPanelOpen(false)}
              onDetailView={handleDetailView}
              predictionData={predictionData}
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
              updateMapData={updateMapData}
            />
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