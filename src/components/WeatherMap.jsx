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
import { getWeatherLayer, getOpenWeatherTemperatureLayer } from '../utils/weatherApiUtils';
import WeatherLayerControls from './WeatherLayerControls';
import MapLayerToggle from './MapLayerToggle';

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
  const [showDefaultStyle, setShowDefaultStyle] = useState(true); // New state

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cld5h233p000q01qat06k4qw7',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('load', () => {
      addWeatherLayers();
      fetchLassaFeverCases();
      addOpenWeatherLayer();
      addDefaultStyleLayer(); // New function call
      console.log('Map loaded and layers added');
    });

    return () => map.current && map.current.remove();
  }, []);

  const addDefaultStyleLayer = () => {
    map.current.addSource('default-style', {
      type: 'raster',
      tiles: ['https://api.mapbox.com/styles/v1/akanimo1/cld5h233p000q01qat06k4qw7/tiles/256/{z}/{x}/{y}@2x?access_token=' + mapboxgl.accessToken],
      tileSize: 256
    });

    map.current.addLayer({
      id: 'default-style-layer',
      type: 'raster',
      source: 'default-style',
      layout: { visibility: showDefaultStyle ? 'visible' : 'none' }
    });
  };

  const toggleDefaultStyle = () => {
    setShowDefaultStyle(!showDefaultStyle);
    if (map.current.getLayer('default-style-layer')) {
      map.current.setLayoutProperty(
        'default-style-layer',
        'visibility',
        showDefaultStyle ? 'none' : 'visible'
      );
    }
  };

  const addWeatherLayers = async () => {
    const layers = ['precipitation', 'temp', 'clouds', 'wind'];
    for (const layer of layers) {
      try {
        const source = await getWeatherLayer(layer);
        map.current.addSource(layer, source);
        map.current.addLayer({
          id: layer,
          type: 'raster',
          source: layer,
          layout: {
            visibility: 'none'
          },
          paint: {
            'raster-opacity': 0.8
          }
        });
        console.log(`Added layer: ${layer}`);
      } catch (error) {
        console.error(`Error adding layer ${layer}:`, error);
      }
    }
  };

  const addOpenWeatherLayer = () => {
    const temperatureSource = getOpenWeatherTemperatureLayer();
    map.current.addSource('openWeatherTemperature', temperatureSource);

    map.current.addLayer({
      id: 'openWeatherTemperatureLayer',
      type: 'raster',
      source: 'openWeatherTemperature',
      layout: { visibility: 'none' },
      paint: { 'raster-opacity': 0.8 },
    });
  };

  const toggleOpenWeatherLayer = () => {
    const visibility = showOpenWeather ? 'none' : 'visible';
    map.current.setLayoutProperty('openWeatherTemperatureLayer', 'visibility', visibility);
    setShowOpenWeather(!showOpenWeather);
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
        <AnimatePresence>
          {leftPanelOpen && (
            <div className="pointer-events-auto">
              <LeftSidePanel 
                isOpen={leftPanelOpen} 
                onClose={() => setLeftPanelOpen(false)}
                activeLayers={activeLayers}
                onLayerToggle={handleLayerToggle}
                onOpacityChange={handleOpacityChange}
                layers={['precipitation', 'temp', 'clouds', 'wind']}
                selectAll={false}
                onSelectAllLayers={handleSelectAllLayers}
              />
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {rightPanelOpen && (
            <div className="pointer-events-auto">
              <RightSidePanel 
                isOpen={rightPanelOpen} 
                onClose={() => setRightPanelOpen(false)}
                selectedPoint={selectedPoint}
              />
            </div>
          )}
        </AnimatePresence>
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
          <MapLayerToggle
            showDefaultStyle={showDefaultStyle}
            toggleDefaultStyle={toggleDefaultStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;