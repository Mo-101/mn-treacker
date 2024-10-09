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
import { addCustomLayers, toggleWindLayer } from './MapLayers';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 }); // Centered on Nigeria
  const [activeLayers, setActiveLayers] = useState([]);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [windLayerVisible, setWindLayerVisible] = useState(true);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
    });

    map.current.on('load', () => {
      addCustomLayers(map.current);
      toggleWindLayer(map.current, windLayerVisible);
    });

    map.current.on('move', () => {
      const center = map.current.getCenter();
      setMapState({
        lng: center.lng.toFixed(4),
        lat: center.lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2)
      });
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;
    activeLayers.forEach(layer => {
      if (map.current.getLayer(layer)) {
        map.current.setLayoutProperty(layer, 'visibility', 'visible');
        map.current.setPaintProperty(layer, 'raster-opacity', layerOpacity / 100);
      }
    });
  }, [activeLayers, layerOpacity]);

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
  };

  const handleWindLayerToggle = () => {
    setWindLayerVisible(!windLayerVisible);
    if (map.current) {
      toggleWindLayer(map.current, !windLayerVisible);
    }
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
              windLayerVisible={windLayerVisible}
              onWindLayerToggle={handleWindLayerToggle}
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