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
import { getWeatherLayer } from '../utils/weatherApiUtils';

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
  const [activeLayer, setActiveLayer] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  const layers = ['precipitation', 'temp', 'clouds', 'wind'];

  useEffect(() => {
    if (map.current) return;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v10', // Fallback to default Mapbox style
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        transformRequest: (url, resourceType) => {
          // Handle missing images gracefully
          if (resourceType === 'Image' && url.includes('wizard-logo.png')) {
            return {
              url: '/placeholder.svg' // Use local placeholder image
            };
          }
        }
      });

      map.current.on('load', () => {
        addWeatherLayers();
        console.log('Map loaded and layers added');
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        toast({
          title: "Map Error",
          description: "An error occurred with the map. Some features may be limited.",
          variant: "destructive",
        });
      });

      return () => map.current && map.current.remove();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  }, []);

  const addWeatherLayers = async () => {
    for (const layer of layers) {
      try {
        const source = await getWeatherLayer(layer);
        if (!map.current.getSource(layer)) {
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
        }
      } catch (error) {
        toast({
          title: "Warning",
          description: `Failed to load ${layer} layer. Some features may be limited.`,
          variant: "warning",
        });
      }
    }
  };

  const handleLayerToggle = (layerId) => {
    if (selectAll) return;

    console.log(`Toggling layer: ${layerId}`);
    const newVisibility = activeLayer === layerId ? 'none' : 'visible';

    layers.forEach(layer => {
      if (map.current.getLayer(layer)) {
        map.current.setLayoutProperty(layer, 'visibility', layer === layerId ? newVisibility : 'none');
      }
    });

    setActiveLayer(activeLayer === layerId ? null : layerId);
    setActiveLayers(newVisibility === 'visible' ? [layerId] : []);
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
                layers={layers}
                selectAll={selectAll}
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
      </div>
    </div>
  );
};

export default WeatherMap;