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

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

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
  const [showOpenWeather, setShowOpenWeather] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(80);
  const [detections, setDetections] = useState([
    {
      coordinates: [8, 10],
      species: 'Mastomys natalensis',
      confidence: 95,
      timestamp: new Date().toISOString(),
      details: 'Adult specimen detected',
      habitat: 'Urban environment',
      behavior: 'Foraging activity'
    }
  ]);

  useEffect(() => {
    if (map.current) return;
    
    const customStyle = {
      version: 8,
      sources: {
        'google-satellite': {
          type: 'raster',
          tiles: ['https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'],
          tileSize: 256
        },
        'google-hybrid': {
          type: 'raster',
          tiles: ['https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'],
          tileSize: 256
        }
      },
      layers: [
        {
          id: 'satellite-base',
          type: 'raster',
          source: 'google-satellite',
          minzoom: 0,
          maxzoom: 22
        },
        {
          id: 'hybrid-overlay',
          type: 'raster',
          source: 'google-hybrid',
          minzoom: 0,
          maxzoom: 22
        }
      ]
    };

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: customStyle,
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      bearing: 360.0,
      pitch: 0,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.current.addControl(new mapboxgl.AttributionControl({
      customAttribution: 'Imagery © Google',
      compact: false
    }));

    map.current.on('load', async () => {
      await addCustomLayers(map.current);
    });

    return () => map.current && map.current.remove();
  }, []);

  const handleLayerToggle = (layerId) => {
    if (map.current) {
      const visibility = map.current.getLayoutProperty(layerId, 'visibility');
      const newVisibility = visibility === 'visible' ? 'none' : 'visible';
      
      map.current.setLayoutProperty(layerId, 'visibility', newVisibility);
      
      setActiveLayers(prev => 
        newVisibility === 'visible'
          ? [...prev, layerId]
          : prev.filter(id => id !== layerId)
      );
    }
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    activeLayers.forEach(layerId => {
      if (map.current.getLayer(layerId)) {
        map.current.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
      }
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {map.current && (
        <>
          <DetectionSpotLayer map={map.current} detections={detections} />
          <LassaFeverCasesLayer map={map.current} />
        </>
      )}
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
                addToConsoleLog={(log) => console.log(log)}
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
    </div>
  );
};

export default WeatherMap;