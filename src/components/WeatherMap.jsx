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
import WeatherLayerControls from './WeatherLayerControls';
import SidePanels from './SidePanels';
import { addWeatherLayers, addAdminBoundariesLayer } from '../utils/mapLayers';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState(['default']);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [mastomysData, setMastomysData] = useState([]);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cld5h233p000q01qat06k4qw7',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('load', () => {
      addWeatherLayers(map.current);
      addAdminBoundariesLayer(map.current);
      fetchLassaFeverCases();
      console.log('Map loaded and layers added');
    });

    return () => map.current && map.current.remove();
  }, []);

  const toggleLayer = (layerName) => {
    if (!map.current) return;

    setActiveLayers(prevLayers => {
      const newLayers = prevLayers.includes(layerName)
        ? prevLayers.filter(layer => layer !== layerName)
        : [...prevLayers, layerName];

      const allLayers = ['temperature', 'precipitation', 'clouds', 'radar', 'wind', 'default'];
      allLayers.forEach(layer => {
        if (layer === 'default') {
          map.current.style.stylesheet.layers.forEach((styleLayer) => {
            if (!styleLayer.id.startsWith('weather-') && styleLayer.id !== 'admin-boundaries-layer') {
              map.current.setLayoutProperty(styleLayer.id, 'visibility', newLayers.includes('default') ? 'visible' : 'none');
            }
          });
        } else {
          map.current.setLayoutProperty(`weather-${layer}`, 'visibility', newLayers.includes(layer) ? 'visible' : 'none');
        }
      });

      return newLayers;
    });
  };

  const fetchLassaFeverCases = async () => {
    try {
      const response = await fetch('/api/cases');
      if (!response.ok) {
        throw new Error('Failed to fetch Lassa Fever cases');
      }
      const data = await response.json();
      addLassaFeverLayer(data);
    } catch (error) {
      console.error('Error fetching Lassa Fever cases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch Lassa Fever cases. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const addLassaFeverLayer = (data) => {
    if (!map.current.getSource('lassa-fever-cases')) {
      map.current.addSource('lassa-fever-cases', {
        type: 'geojson',
        data: data
      });

      map.current.addLayer({
        id: 'lassa-fever-points',
        type: 'circle',
        source: 'lassa-fever-cases',
        paint: {
          'circle-radius': 6,
          'circle-color': '#FF0000',
          'circle-opacity': 0.7
        }
      });
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
        <MastomysTracker data={mastomysData} map={map.current} />
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
          handleLayerToggle={toggleLayer}
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
            activeLayers={activeLayers}
            toggleLayer={toggleLayer}
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;
