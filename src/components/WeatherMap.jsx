import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LayerPanel from './LayerPanel';
import BottomPanel from './BottomPanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import { initializeAerisMap, cleanupAerisMap } from '../utils/aerisMapUtils';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const aerisApp = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8.6753, lat: 9.0820, zoom: 5 });
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeAerisMap(mapContainer, aerisApp, mapState, toast);
    return () => cleanupAerisMap(aerisApp);
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
              aerisApp={aerisApp.current}
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