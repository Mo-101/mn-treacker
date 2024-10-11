import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { initializeAerisMap, cleanupAerisMap, toggleAerisLayer } from '../utils/aerisMapUtils';

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
  const [predictionData, setPredictionData] = useState([]);

  const addToConsoleLog = useCallback((message) => {
    console.log(message);
    toast({
      title: "Map Update",
      description: message,
    });
  }, [toast]);

  const addCustomLayers = useCallback((map) => {
    const layers = [
      { id: 'radar', name: 'Radar' },
      { id: 'satellite', name: 'Satellite' },
      { id: 'temperatures', name: 'Temperature' },
      { id: 'wind-particles', name: 'Wind' },
      { id: 'precipitation', name: 'Precipitation' },
      { id: 'clouds', name: 'Clouds' },
    ];

    layers.forEach(layer => {
      if (!map.getLayer(layer.id)) {
        map.addLayer({
          id: layer.id,
          type: 'raster',
          source: {
            type: 'raster',
            tiles: [`https://maps.aerisapi.com/${import.meta.env.VITE_XWEATHER_ID}_${import.meta.env.VITE_XWEATHER_SECRET}/${layer.id}/{z}/{x}/{y}/current.png`],
            tileSize: 256,
          },
          layout: { visibility: 'none' },
        });
      }
    });

    addToConsoleLog('Custom layers added successfully');
  }, [addToConsoleLog]);

  useEffect(() => {
    if (map.current) return;
    initializeMap(mapContainer, map, mapState, setMapState, addCustomLayers, updateMapState, toast);
    initializeAerisMap(mapContainer.current, aerisApp, mapState, toast, addToConsoleLog);

    return () => {
      if (map.current) map.current.remove();
      cleanupAerisMap(aerisApp);
    };
  }, [mapState, addCustomLayers, addToConsoleLog, toast]);

  useEffect(() => {
    if (map.current) {
      fetchWeatherData(map.current, mapState, addToConsoleLog);
      fetchMastomysData(setMastomysData, addToConsoleLog);
    }
  }, [mapState, addToConsoleLog]);

  useEffect(() => {
    const eventSource = new EventSource('/api/weather-data');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStreamingWeatherData(data);
      addToConsoleLog('Received new weather data');
    };
    return () => eventSource.close();
  }, [addToConsoleLog]);

  const updateMapState = useCallback(() => {
    if (!map.current) return;
    const center = map.current.getCenter();
    setMapState({
      lng: center.lng.toFixed(4),
      lat: center.lat.toFixed(4),
      zoom: map.current.getZoom().toFixed(2)
    });
    addToConsoleLog('Map state updated');
  }, [addToConsoleLog]);

  const handleDetailView = useCallback((highRiskArea) => {
    setPredictionPanelOpen(false);
    if (map.current) {
      map.current.flyTo({
        center: highRiskArea.center,
        zoom: 10,
        essential: true
      });

      if (map.current.getLayer('highlight-layer')) {
        map.current.removeLayer('highlight-layer');
      }
      if (map.current.getSource('highlight-source')) {
        map.current.removeSource('highlight-source');
      }

      map.current.addSource('highlight-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: highRiskArea.geometry
        }
      });

      map.current.addLayer({
        id: 'highlight-layer',
        type: 'fill',
        source: 'highlight-source',
        paint: {
          'fill-color': '#FF0000',
          'fill-opacity': 0.5
        }
      });
    }
    addToConsoleLog(`Highlighting high-risk area: ${highRiskArea.name}`);
  }, [addToConsoleLog]);

  const updateMapData = useCallback((newData) => {
    if (map.current) {
      updatePredictionLayer(map.current, newData);
      setPredictionData(newData);
      addToConsoleLog('Map updated with new prediction data');
    }
  }, [addToConsoleLog]);

  const handleLayerToggleWrapper = useCallback((layerId) => {
    handleLayerToggle(layerId, map.current, setActiveLayers, addToConsoleLog);
    toggleAerisLayer(aerisApp.current, layerId, !activeLayers.includes(layerId));
  }, [activeLayers, addToConsoleLog]);

  const handleOpacityChangeWrapper = useCallback((opacity) => {
    handleOpacityChange(opacity, map.current, activeLayers, setLayerOpacity, addToConsoleLog);
    if (aerisApp.current && aerisApp.current.map && aerisApp.current.map.layers) {
      activeLayers.forEach(layerId => {
        aerisApp.current.map.layers.setLayerOpacity(layerId, opacity / 100);
      });
    }
  }, [activeLayers, addToConsoleLog]);

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
              onLayerToggle={handleLayerToggleWrapper}
              onOpacityChange={handleOpacityChangeWrapper}
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
            <p>Wind Speed: {streamingWeatherData.windSpeed} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherMap;