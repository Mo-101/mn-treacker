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
import WeatherControls from './WeatherControls';
import SidePanels from './SidePanels';
import MapLegend from './MapLegend';
import { initializeMap, addWeatherLayers } from '../utils/mapInitialization';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
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
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      projection: 'mercator',
      renderWorldCopies: true
    });

    map.current.on('load', async () => {
      // Add terrain and enhanced satellite layers
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });

      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // Enhance satellite imagery
      map.current.addSource('satellite', {
        'type': 'raster',
        'url': 'mapbox://mapbox.satellite',
        'tileSize': 512,
        'maxzoom': 22
      });

      map.current.addLayer({
        'id': 'enhanced-satellite',
        'type': 'raster',
        'source': 'satellite',
        'paint': {
          'raster-saturation': 0.5,
          'raster-contrast': 0.2,
          'raster-brightness-min': 0.2,
          'raster-brightness-max': 1
        }
      });

      // Add weather layers
      await addWeatherLayers(map.current);
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
        <DetectionSpotLayer map={map.current} detections={detections} />
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