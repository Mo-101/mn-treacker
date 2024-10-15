import React, { useEffect, useRef, useState } from 'react';
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
import { initializeMap, toggleLayer, setLayerOpacity } from '../utils/mapUtils';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState(['temp']);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [mastomysData, setMastomysData] = useState([]);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [ratDetections, setRatDetections] = useState([]);
  const [ratPredictions, setRatPredictions] = useState([]);

  useEffect(() => {
    if (map.current) return;
    map.current = initializeMap(mapContainer.current, mapState);
    map.current.on('load', () => {
      fetchLassaFeverCases();
      fetchRatDetectionsAndPredictions();
      console.log('Map loaded and layers added');
    });

    return () => map.current && map.current.remove();
  }, []);

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

  const fetchRatDetectionsAndPredictions = async () => {
    try {
      const response = await fetch('/api/rat-data');
      if (!response.ok) {
        throw new Error('Failed to fetch rat detections and predictions');
      }
      const data = await response.json();
      setRatDetections(data.detections);
      setRatPredictions(data.predictions);
      addRatLayers();
    } catch (error) {
      console.error('Error fetching rat data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rat detection and prediction data. Please try again later.",
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

  const addRatLayers = () => {
    if (!map.current.getSource('rat-detections')) {
      map.current.addSource('rat-detections', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: ratDetections.map(detection => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [detection.lng, detection.lat]
            },
            properties: {
              id: detection.id
            }
          }))
        }
      });

      map.current.addLayer({
        id: 'rat-detection-points',
        type: 'circle',
        source: 'rat-detections',
        paint: {
          'circle-radius': 8,
          'circle-color': '#FF0000',
          'circle-opacity': 0.7
        }
      });
    }

    if (!map.current.getSource('rat-predictions')) {
      map.current.addSource('rat-predictions', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: ratPredictions.map(prediction => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [prediction.lng, prediction.lat]
            },
            properties: {
              id: prediction.id,
              probability: prediction.probability
            }
          }))
        }
      });

      map.current.addLayer({
        id: 'rat-prediction-points',
        type: 'circle',
        source: 'rat-predictions',
        paint: {
          'circle-radius': 8,
          'circle-color': '#00FF00',
          'circle-opacity': ['interpolate', ['linear'], ['get', 'probability'], 0, 0.1, 1, 0.7]
        }
      });
    }
  };

  const handleLayerToggle = (layerId) => {
    toggleLayer(map.current, layerId, !activeLayers.includes(layerId));
    setActiveLayers(prev =>
      prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
    );
  };

  const handleOpacityChange = (layerId, opacity) => {
    setLayerOpacity(map.current, layerId, opacity);
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