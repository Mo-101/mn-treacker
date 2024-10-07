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
import { initializeMap, addMapLayers, updateMapState } from '../utils/mapUtils';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayer, setActiveLayer] = useState('default');
  const [ratSightings, setRatSightings] = useState([]);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);

  useEffect(() => {
    if (map.current) return;
    initializeMap(mapContainer, map, mapState, setMapState, addMapLayers, updateMapState, toast);
  }, []);

  useEffect(() => {
    if (!map.current) return;

    const toggleLayer = (layerId, visibility) => {
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, 'visibility', visibility);
      }
    };

    const layers = ['temperature', 'vegetation', 'precipitation', 'wind', 'clouds', 'radar'];
    layers.forEach(layer => toggleLayer(`${layer}-layer`, 'none'));

    if (activeLayer !== 'default') {
      toggleLayer(`${activeLayer}-layer`, 'visible');
    }

    const baseStyle = activeLayer === 'temperature' 
      ? 'mapbox://styles/akanimo1/cld5h233p000q01qat06k4qw7'
      : 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m';
    
    const fadeTransition = () => {
      const fadeOverlay = document.createElement('div');
      fadeOverlay.style.position = 'absolute';
      fadeOverlay.style.top = '0';
      fadeOverlay.style.left = '0';
      fadeOverlay.style.width = '100%';
      fadeOverlay.style.height = '100%';
      fadeOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      fadeOverlay.style.transition = 'opacity 0.5s ease-in-out';
      fadeOverlay.style.opacity = '0';
      fadeOverlay.style.pointerEvents = 'none';
      mapContainer.current.appendChild(fadeOverlay);

      setTimeout(() => {
        fadeOverlay.style.opacity = '1';
      }, 50);

      setTimeout(() => {
        map.current.setStyle(baseStyle);
      }, 250);

      setTimeout(() => {
        fadeOverlay.style.opacity = '0';
      }, 500);

      setTimeout(() => {
        mapContainer.current.removeChild(fadeOverlay);
      }, 1000);
    };

    fadeTransition();
  }, [activeLayer]);

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
  };

  const handleSearch = (query) => {
    try {
      console.log('Searching for Mastomys natalensis:', query);
      const newSighting = {
        latitude: 7 + Math.random() * 2,
        longitude: 9 + Math.random() * 2,
        confidence: Math.random()
      };
      setRatSightings(prevSightings => [...prevSightings, newSighting]);
      new mapboxgl.Marker()
        .setLngLat([newSighting.longitude, newSighting.latitude])
        .addTo(map.current);
    } catch (error) {
      console.error('Error during search:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePointClick = (point) => {
    setSelectedPoint(point);
    setRightPanelOpen(true);
  };

  return (
    <div className="relative w-full h-screen flex flex-col">
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
              activeLayer={activeLayer}
              onLayerChange={handleLayerChange}
              onSearch={handleSearch}
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