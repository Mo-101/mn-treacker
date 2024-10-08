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
import { initializeMap, updateMapState } from '../utils/mapUtils';
import { addCustomLayers, addXweatherRadarAnimation, addWindLayer } from './MapLayers';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: -28, lat: 47, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState([]);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      maxZoom: 5,
      minZoom: 2
    });

    map.current.on('load', () => {
      addCustomLayers(map.current);
      addXweatherRadarAnimation(map.current);
      addWindLayer(map.current);
    });

    map.current.on('move', () => {
      updateMapState(map.current, setMapState);
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;
    updateLayerVisibility();
  }, [activeLayers, layerOpacity]);

  const updateLayerVisibility = () => {
    const layers = ['temperature', 'vegetation', 'precipitation', 'wind', 'clouds', 'radar'];
    layers.forEach(layer => {
      if (map.current.getLayer(layer)) {
        const visibility = activeLayers.includes(layer) ? 'visible' : 'none';
        map.current.setLayoutProperty(layer, 'visibility', visibility);
        if (visibility === 'visible') {
          map.current.setPaintProperty(layer, 'raster-opacity', layerOpacity / 100);
        }
      }
    });
  };

  const handleLayerChange = (layer) => {
    setActiveLayers(prev => 
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
  };

  const handleSearch = async (query) => {
    // Implement search functionality here
    console.log('Searching for:', query);
    // You can add markers or highlight areas based on the search results
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#0f172a] text-white">
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
      />
      <div className="flex-grow relative">
        <div ref={mapContainer} className="absolute inset-0" />
        <AnimatePresence>
          {leftPanelOpen && (
            <LeftSidePanel 
              isOpen={leftPanelOpen} 
              onClose={() => setLeftPanelOpen(false)}
              activeLayers={activeLayers}
              onLayerChange={handleLayerChange}
              onOpacityChange={handleOpacityChange}
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
        <BottomPanel />
      </div>
      <FloatingInsightsBar />
      <AnimatePresence>
        {aiTrainingOpen && (
          <AITrainingInterface
            isOpen={aiTrainingOpen}
            onClose={() => setAiTrainingOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherMap;