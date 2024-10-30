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
import PredictionPanel from './PredictionPanel';
import DetectionSpotLayer from './DetectionSpotLayer';
import LassaFeverCasesLayer from './LassaFeverCasesLayer';
import WeatherControls from './WeatherControls';
import SidePanels from './SidePanels';
import MapLegend from './MapLegend';
import { addCustomLayers } from '../utils/mapLayers';
import { initializeMap, updateMapState } from '../utils/mapUtils';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState([]);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(80);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = initializeMap(mapContainer.current, mapState);

      map.current.on('load', () => {
        addCustomLayers(map.current);
        toast({
          title: "Map Initialized",
          description: "Weather map layers loaded successfully",
        });
      });

      map.current.on('move', () => {
        updateMapState(map.current, setMapState);
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your configuration.",
        variant: "destructive",
      });
    }
  }, []);

  const handleLayerToggle = (layerId) => {
    if (!map.current) return;
    
    const isActive = activeLayers.includes(layerId);
    if (isActive) {
      setActiveLayers(prev => prev.filter(id => id !== layerId));
      map.current.setLayoutProperty(layerId, 'visibility', 'none');
    } else {
      setActiveLayers(prev => [...prev, layerId]);
      map.current.setLayoutProperty(layerId, 'visibility', 'visible');
    }
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    activeLayers.forEach(layerId => {
      if (map.current) {
        map.current.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
      }
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <TopNavigationBar 
            onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
            onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
            onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
          />
        </div>

        <SidePanels
          leftPanelOpen={leftPanelOpen}
          rightPanelOpen={rightPanelOpen}
          setLeftPanelOpen={setLeftPanelOpen}
          setRightPanelOpen={setRightPanelOpen}
          activeLayers={activeLayers}
          handleLayerToggle={handleLayerToggle}
          handleOpacityChange={handleOpacityChange}
          selectedPoint={selectedPoint}
        />

        <AnimatePresence>
          {predictionPanelOpen && (
            <div className="pointer-events-auto">
              <PredictionPanel
                isOpen={predictionPanelOpen}
                onClose={() => setPredictionPanelOpen(false)}
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
              />
            </div>
          )}
        </AnimatePresence>

        <div className="pointer-events-auto absolute bottom-4 left-4">
          <WeatherControls
            activeLayers={activeLayers}
            onLayerToggle={handleLayerToggle}
            layerOpacity={layerOpacity}
            onOpacityChange={handleOpacityChange}
          />
        </div>

        <MapLegend activeLayers={activeLayers} />
      </div>

      {map.current && (
        <>
          <DetectionSpotLayer map={map.current} />
          <LassaFeverCasesLayer map={map.current} />
        </>
      )}
    </div>
  );
};

export default WeatherMap;