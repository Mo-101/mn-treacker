import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchRatData, fetchLassaFeverCases } from '../utils/api';
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
import MapInitializer from './MapInitializer';
import WindGLLayer from './WindGLLayer';
import { toggleLayer, setLayerOpacity } from '../utils/mapLayers';
import { useToast } from './ui/use-toast';

if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
}

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState(['precipitation', 'temperature', 'clouds', 'wind']);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(80);
  const { toast } = useToast();

  // Fetch data using React Query
  const { data: ratData, isLoading: ratLoading } = useQuery({
    queryKey: ['rat-data'],
    queryFn: fetchRatData,
    staleTime: 300000, // 5 minutes
  });

  const { data: lassaData, isLoading: lassaLoading } = useQuery({
    queryKey: ['lassa-cases'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000, // 5 minutes
  });

  const handleLayerToggle = (layerId) => {
    if (map.current) {
      const isActive = activeLayers.includes(layerId);
      toggleLayer(map.current, layerId, !isActive);
      setActiveLayers(prev => 
        isActive ? prev.filter(id => id !== layerId) : [...prev, layerId]
      );
    }
  };

  const handleOpacityChange = (opacity) => {
    if (map.current) {
      setLayerOpacity(opacity);
      activeLayers.forEach(layerId => {
        setLayerOpacity(map.current, layerId, opacity);
      });
    }
  };

  useEffect(() => {
    if (!map.current) return;

    const updateMapState = () => {
      const center = map.current.getCenter();
      setMapState({
        lng: center.lng.toFixed(4),
        lat: center.lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2)
      });
    };

    map.current.on('move', updateMapState);

    return () => {
      if (map.current) {
        map.current.off('move', updateMapState);
      }
    };
  }, []);

  if (ratLoading || lassaLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-yellow-400 text-xl">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      <MapInitializer 
        map={map}
        mapContainer={mapContainer}
        mapState={mapState}
      />

      {map.current && <WindGLLayer map={map.current} />}

      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
        onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
      />

      <SidePanels
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        setLeftPanelOpen={setLeftPanelOpen}
        setRightPanelOpen={setRightPanelOpen}
        activeLayers={activeLayers}
        handleLayerToggle={handleLayerToggle}
        handleOpacityChange={handleOpacityChange}
      />

      <AnimatePresence>
        {predictionPanelOpen && (
          <PredictionPanel
            isOpen={predictionPanelOpen}
            onClose={() => setPredictionPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      <FloatingInsightsBar />

      <AnimatePresence>
        {aiTrainingOpen && (
          <AITrainingInterface
            isOpen={aiTrainingOpen}
            onClose={() => setAiTrainingOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-4 z-10">
        <WeatherControls
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          layerOpacity={layerOpacity}
          onOpacityChange={handleOpacityChange}
        />
      </div>

      <MapLegend activeLayers={activeLayers} />

      {map.current && (
        <>
          <DetectionSpotLayer map={map.current} detections={ratData?.features || []} />
          <LassaFeverCasesLayer map={map.current} cases={lassaData?.features || []} />
        </>
      )}
    </div>
  );
};

export default WeatherMap;