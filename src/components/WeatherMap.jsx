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
import { initializeMap, handleLayerToggle, handleOpacityChange, fetchWeatherData, fetchMastomysData } from '../utils/mapUtils';

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

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      pitch: 45,
      bearing: 0,
      antialias: true
    });

    map.current.on('load', () => {
      map.current.addControl(new mapboxgl.NavigationControl());
      addCustomLayers(map.current);
      updateMapState();
    });

    map.current.on('move', updateMapState);

    map.current.on('style.load', () => {
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    });

    return () => map.current.remove();
  }, []);

  useEffect(() => {
    if (map.current) {
      fetchWeatherData(map.current, mapState, addToConsoleLog);
      fetchMastomysData(setMastomysData, addToConsoleLog);
    }
  }, [mapState]);

  const addCustomLayers = (map) => {
    // Add custom layers here, but set them to invisible by default
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

  const handleLayerToggle = (layerId) => {
    if (map.current) {
      const updatedLayers = activeLayers.includes(layerId)
        ? activeLayers.filter(id => id !== layerId)
        : [...activeLayers, layerId];
      
      setActiveLayers(updatedLayers);
      
      updatedLayers.forEach(id => {
        map.current.setLayoutProperty(id, 'visibility', 'visible');
      });
      
      layers.forEach(layer => {
        if (!updatedLayers.includes(layer.id)) {
          map.current.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
      
      addToConsoleLog(`Layer ${layerId} ${updatedLayers.includes(layerId) ? 'enabled' : 'disabled'}`);
    }
  };

  const handleDetailView = () => {
    // Implement logic to focus main map on prediction details
    setPredictionPanelOpen(false);
    // Add code to update main map view
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
                onOpacityChange={(opacity) => handleOpacityChange(opacity, map.current, activeLayers, setLayerOpacity, addToConsoleLog)}
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
      </div>
    </div>
  );
};

export default WeatherMap;