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

  const weatherLayers = [
    { id: 'radar', name: 'Radar', url: 'https://maps.aerisapi.com/{client_id}_{client_secret}/radar/{z}/{x}/{y}/current.png' },
    { id: 'temperature', name: 'Temperature', url: 'https://maps.aerisapi.com/{client_id}_{client_secret}/temp/{z}/{x}/{y}/current.png' },
    { id: 'precip', name: 'Precipitation', url: 'https://maps.aerisapi.com/{client_id}_{client_secret}/precip/{z}/{x}/{y}/current.png' },
    { id: 'wind', name: 'Wind', url: 'https://maps.aerisapi.com/{client_id}_{client_secret}/wind/{z}/{x}/{y}/current.png' },
  ];

  const fetchLayer = (layer) => {
    const clientId = import.meta.env.VITE_AERIS_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_AERIS_CLIENT_SECRET;
    const layerUrl = layer.url.replace('{client_id}', clientId).replace('{client_secret}', clientSecret);

    if (!map.current.getSource(layer.id)) {
      map.current.addSource(layer.id, {
        type: 'raster',
        tiles: [layerUrl],
        tileSize: 256,
      });

      map.current.addLayer({
        id: layer.id,
        type: 'raster',
        source: layer.id,
        paint: { 'raster-opacity': 0.7 },
        layout: { visibility: 'none' },
      });
    }
  };

  const toggleLayer = (layerId) => {
    const layer = weatherLayers.find(l => l.id === layerId);
    if (layer) {
      fetchLayer(layer);
      handleLayerToggle(layerId, map.current, setActiveLayers, addToConsoleLog);
    }
  };

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
    weatherLayers.forEach(layer => fetchLayer(layer));
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
                onOpacityChange={(opacity) => handleOpacityChange(opacity, map.current, activeLayers, setLayerOpacity, addToConsoleLog)}
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