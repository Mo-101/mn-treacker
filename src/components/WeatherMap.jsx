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
import { fetchRatData, fetchLassaFeverCases } from '../utils/dataFetching';

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
  const [ratData, setRatData] = useState(null);
  const [lassaFeverCases, setLassaFeverCases] = useState(null);

  useEffect(() => {
    if (map.current) return;
    map.current = initializeMap(mapContainer.current, mapState);
    map.current.on('load', () => {
      fetchInitialData();
      console.log('Map loaded and layers added');
    });

    return () => map.current && map.current.remove();
  }, []);

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
    if (map.current && map.current.getLayer(layerId)) {
      const visibility = map.current.getLayoutProperty(layerId, 'visibility');
      const newVisibility = visibility === 'visible' ? 'none' : 'visible';
      map.current.setLayoutProperty(layerId, 'visibility', newVisibility);
      setActiveLayers(prev => 
        newVisibility === 'visible' 
          ? [...prev, layerId] 
          : prev.filter(id => id !== layerId)
      );
    } else {
      console.warn(`Layer ${layerId} not found on the map.`);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
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
