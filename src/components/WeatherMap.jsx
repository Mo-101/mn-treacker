import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LayerPanel from './LayerPanel';
import BottomPanel from './BottomPanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import { AerisMapsGL } from '@aerisweather/mapsgl';
import '@aerisweather/mapsgl/dist/styles/styles.css';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8.6753, lat: 9.0820, zoom: 5 });
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new AerisMapsGL({
      container: mapContainer.current,
      accessToken: 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      account: 'r8ZBl3l7eRPGBVBs3B2GD',
      secret: 'e3LxlhWReUM20kV7pkCTssDcl0c99dKtJ7A93ygW',
      layers: ['radar', 'temperatures']
    });

    map.current.on('load', () => {
      console.log('Map is loaded');
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <TopNavigationBar 
        onLayerToggle={() => setLayerPanelOpen(!layerPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
      />
      <div className="absolute inset-0">
        <div ref={mapContainer} className="w-full h-full" />
        <AnimatePresence>
          {layerPanelOpen && (
            <LayerPanel 
              isOpen={layerPanelOpen} 
              onClose={() => setLayerPanelOpen(false)}
              map={map.current}
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