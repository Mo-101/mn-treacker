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
import MastomysTracker from './MastomysTracker';
import PredictionPanel from './PredictionPanel';
import PathTrackingLayer from './PathTrackingLayer';
import { initializeMap, addWeatherLayers, addOpenWeatherLayer } from '../utils/mapInitialization';
import WeatherLayerControls from './WeatherLayerControls';
import SidePanels from './SidePanels';
import { fetchLassaFeverCases } from '../utils/api';
import MapLegend from './MapLegend';

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
  const [mastomysData, setMastomysData] = useState([]);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [showOpenWeather, setShowOpenWeather] = useState(false);

  const [pathTrackingData, setPathTrackingData] = useState([]);

  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('load', async () => {
      addWeatherLayers(map.current);
      try {
        const cases = await fetchLassaFeverCases();
        console.log('Fetched Lassa fever cases:', cases);
        
        // Mock path tracking data - replace with real data in production
        setPathTrackingData([
          {
            coordinates: [
              [mapState.lng, mapState.lat],
              [mapState.lng + 0.1, mapState.lat + 0.1],
              [mapState.lng + 0.2, mapState.lat + 0.15]
            ],
            speed: 5,
            timestamp: Date.now(),
            density: 0.5,
            isKeyPoint: true
          }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      }
      addOpenWeatherLayer(map.current);
      console.log('Map loaded and layers added');
    });

    return () => map.current && map.current.remove();
  }, []);

  const toggleOpenWeatherLayer = () => {
    if (map.current) {
      const visibility = showOpenWeather ? 'none' : 'visible';
      map.current.setLayoutProperty('openWeatherTemperatureLayer', 'visibility', visibility);
      map.current.setLayoutProperty('temperature', 'visibility', visibility);
      setShowOpenWeather(!showOpenWeather);
    }
  };

  const handleLayerToggle = (layerId) => {
    if (activeLayers.includes(layerId)) {
      map.current.setLayoutProperty(layerId, 'visibility', 'none');
      setActiveLayers(activeLayers.filter(id => id !== layerId));
    } else {
      map.current.setLayoutProperty(layerId, 'visibility', 'visible');
      setActiveLayers([...activeLayers, layerId]);
    }
  };

  const handleSelectAllLayers = () => {
    const newSelectAllState = !selectAll;

    layers.forEach(layer => {
      if (map.current.getLayer(layer)) {
        map.current.setLayoutProperty(layer, 'visibility', newSelectAllState ? 'visible' : 'none');
      }
    });

    setSelectAll(newSelectAllState);
    setActiveLayer(null);
    setActiveLayers(newSelectAllState ? layers : []);
  };

  const handleOpacityChange = (layerId, opacity) => {
    if (map.current && map.current.getLayer(layerId)) {
      map.current.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
    }
  };

  const handleDetailView = () => {
    console.log('Detail view requested');
    setPredictionPanelOpen(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      {map.current && (
        <>
          <MastomysTracker data={mastomysData} map={map.current} />
          <PathTrackingLayer map={map.current} trackingData={pathTrackingData} />
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
          handleSelectAllLayers={handleSelectAllLayers}
          selectedPoint={selectedPoint}
        />
        <AnimatePresence>
          {predictionPanelOpen && (
            <div className="pointer-events-auto">
              <PredictionPanel
                isOpen={predictionPanelOpen}
                onClose={() => setPredictionPanelOpen(false)}
                onDetailView={handleDetailView}
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
          <WeatherLayerControls
            showOpenWeather={showOpenWeather}
            toggleOpenWeatherLayer={toggleOpenWeatherLayer}
          />
        </div>
        <MapLegend activeLayers={activeLayers} />
      </div>
    </div>
  );
};

export default WeatherMap;
