import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import PredictionPanel from './PredictionPanel';
import NewsScroll from './NewsScroll';
import RatDataLayer from './RatDataLayer';
import LassaFeverLayer from './LassaFeverLayer';
import { initializeMap, toggleLayer, setLayerOpacity } from '../utils/mapUtils';
import { fetchRatData, fetchLassaFeverCases, fetchTrainingProgress } from '../utils/dataFetching';

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
  const [ratData, setRatData] = useState({ detections: [], predictions: [] });
  const [lassaFeverCases, setLassaFeverCases] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    if (map.current) return;
    map.current = initializeMap(mapContainer.current, mapState);
    map.current.on('load', () => {
      fetchInitialData();
      console.log('Map loaded and layers added');
    });

    return () => map.current && map.current.remove();
  }, []);

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(async () => {
        const progress = await fetchTrainingProgress();
        setTrainingProgress(progress.progress);
        setIsTraining(progress.is_training);
        if (!progress.is_training) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const fetchInitialData = async () => {
    try {
      const [ratDataResponse, lassaFeverResponse] = await Promise.all([
        fetchRatData(),
        fetchLassaFeverCases()
      ]);
      setRatData(ratDataResponse);
      setLassaFeverCases(lassaFeverResponse);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch initial data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleLayerToggle = (layerId) => {
    const isActive = activeLayers.includes(layerId);
    toggleLayer(map.current, layerId, !isActive);
    setActiveLayers(prev =>
      isActive ? prev.filter(id => id !== layerId) : [...prev, layerId]
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
            <LeftSidePanel 
              isOpen={leftPanelOpen} 
              onClose={() => setLeftPanelOpen(false)}
              activeLayers={activeLayers}
              onLayerToggle={handleLayerToggle}
              onOpacityChange={handleOpacityChange}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {rightPanelOpen && (
            <RightSidePanel 
              isOpen={rightPanelOpen} 
              onClose={() => setRightPanelOpen(false)}
              selectedPoint={selectedPoint}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {predictionPanelOpen && (
            <PredictionPanel
              isOpen={predictionPanelOpen}
              onClose={() => setPredictionPanelOpen(false)}
              onDetailView={handleDetailView}
            />
          )}
        </AnimatePresence>
        <FloatingInsightsBar />
        <AnimatePresence>
          {aiTrainingOpen && (
            <AITrainingInterface
              isOpen={aiTrainingOpen}
              onClose={() => setAiTrainingOpen(false)}
              trainingProgress={trainingProgress}
              isTraining={isTraining}
            />
          )}
        </AnimatePresence>
      </div>
      {map.current && (
        <>
          <RatDataLayer map={map.current} ratData={ratData} />
          <LassaFeverLayer map={map.current} cases={lassaFeverCases} />
        </>
      )}
      <NewsScroll />
    </div>
  );
};

export default WeatherMap;