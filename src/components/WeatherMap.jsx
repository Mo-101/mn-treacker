import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LayerPanel from './LayerPanel';
import BottomPanel from './BottomPanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import LayerButtons from './LayerButtons';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8.6753, lat: 9.0820, zoom: 5 });
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    const initializeMap = async () => {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v10',
          center: [mapState.lng, mapState.lat],
          zoom: mapState.zoom
        });

        map.current.on('load', () => {
          console.log('Map is loaded');
          // Add layers or additional setup here
        });

        map.current.on('move', () => {
          const center = map.current.getCenter();
          setMapState({
            lng: center.lng.toFixed(4),
            lat: center.lat.toFixed(4),
            zoom: map.current.getZoom().toFixed(2)
          });
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Error",
          description: "Failed to initialize the map. Please try again later.",
          variant: "destructive",
        });
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [toast]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <TopNavigationBar 
        onLayerToggle={() => setLayerPanelOpen(!layerPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
      />
      <div className="absolute inset-0">
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Add heading */}
        <h1 className="absolute top-16 left-4 text-2xl font-bold text-white bg-black/50 p-2 rounded">
          Mastomys Habitat & Risk Assessment
        </h1>
        
        {/* Add LayerButtons */}
        <div className="absolute top-28 left-4">
          <LayerButtons />
        </div>
        
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