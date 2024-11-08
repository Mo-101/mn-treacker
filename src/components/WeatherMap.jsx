import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchMastomysLocations, fetchLassaFeverCases } from '../utils/api';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import PredictionPanel from './PredictionPanel';
import DetectionSpotLayer from './DetectionSpotLayer';
import LassaFeverCasesLayer from './LassaFeverCasesLayer';
import SidePanels from './SidePanels';
import MapLegend from './MapLegend';
import MapInitializer from './MapInitializer';
import MastomysTracker from './MastomysTracker';
import RodentDetectionPanel from './RodentDetectionPanel';
import { useToast } from './ui/use-toast';

if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
}

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState(['lassa-cases', 'rat-locations']);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [rodentPanelOpen, setRodentPanelOpen] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(80);
  const { toast } = useToast();

  const { data: ratLocations, isError: ratError } = useQuery({
    queryKey: ['ratLocations'],
    queryFn: fetchMastomysLocations,
    staleTime: 300000,
    retry: 2,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch rat location data",
        variant: "destructive",
      });
    }
  });

  const { data: lassaCases, isError: lassaError } = useQuery({
    queryKey: ['lassaCases'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000,
    retry: 2,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch Lassa fever cases",
        variant: "destructive",
      });
    }
  });

  const handleLayerToggle = (layerId) => {
    if (map.current) {
      const isActive = activeLayers.includes(layerId);
      if (isActive) {
        map.current.setLayoutProperty(layerId, 'visibility', 'none');
        setActiveLayers(prev => prev.filter(id => id !== layerId));
      } else {
        map.current.setLayoutProperty(layerId, 'visibility', 'visible');
        setActiveLayers(prev => [...prev, layerId]);
      }
      
      toast({
        title: isActive ? "Layer Hidden" : "Layer Shown",
        description: `${layerId.charAt(0).toUpperCase() + layerId.slice(1)} layer has been ${isActive ? 'hidden' : 'shown'}`,
      });
    }
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    if (map.current) {
      activeLayers.forEach(layerId => {
        if (map.current.getLayer(layerId)) {
          map.current.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
        }
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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      <MapInitializer 
        map={map}
        mapContainer={mapContainer}
        mapState={mapState}
      />

      {map.current && (
        <>
          <DetectionSpotLayer map={map.current} detections={ratLocations} />
          <LassaFeverCasesLayer map={map.current} cases={lassaCases} />
          <MastomysTracker sightings={ratLocations} />
        </>
      )}

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

      <MapLegend activeLayers={activeLayers} />

      <RodentDetectionPanel 
        isOpen={rodentPanelOpen}
        onToggle={() => setRodentPanelOpen(!rodentPanelOpen)}
        detections={ratLocations?.features || []}
      />
    </div>
  );
};

export default WeatherMap;