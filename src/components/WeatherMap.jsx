import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import WeatherLayerToggle from './WeatherLayerToggle';
import RatDetectionPanel from './RatDetectionPanel';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import BottomPanel from './BottomPanel';
import FloatingInsightsButton from './FloatingInsightsButton';
import { initializeMap, addMapLayers, updateMapState } from '../utils/mapUtils';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayer, setActiveLayer] = useState('default');
  const [ratSightings, setRatSightings] = useState([]);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    if (map.current) return;
    initializeMap(mapContainer, map, mapState, setMapState, addMapLayers, updateMapState, toast);
  }, []);

  useEffect(() => {
    if (!map.current) return;

    const toggleLayer = (layerId, visibility) => {
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, 'visibility', visibility);
      }
    };

    const layers = ['temperature-layer', 'wind-layer', 'precipitation-layer'];
    layers.forEach(layer => toggleLayer(layer, 'none'));

    if (activeLayer !== 'default') {
      toggleLayer(`${activeLayer}-layer`, 'visible');
    }

    const baseStyle = activeLayer === 'temperature' 
      ? 'mapbox://styles/akanimo1/cm1xrp15a015001qr2z1d54sd'
      : 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m';
    map.current.setStyle(baseStyle);
  }, [activeLayer]);

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
  };

  const handleSearch = (query) => {
    try {
      console.log('Searching for Mastomys natalensis:', query);
      const newSighting = {
        latitude: 7 + Math.random() * 2,
        longitude: 9 + Math.random() * 2,
        confidence: Math.random()
      };
      setRatSightings(prevSightings => [...prevSightings, newSighting]);
      new mapboxgl.Marker()
        .setLngLat([newSighting.longitude, newSighting.latitude])
        .addTo(map.current);
    } catch (error) {
      console.error('Error during search:', error);
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePointClick = (point) => {
    setSelectedPoint(point);
    setRightPanelOpen(true);
  };

  return (
    <div className="relative w-full h-screen flex flex-col">
      <TopNavigationBar onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)} />
      <div className="flex-grow relative">
        <div ref={mapContainer} className="absolute inset-0" />
        <LeftSidePanel 
          isOpen={leftPanelOpen} 
          onClose={() => setLeftPanelOpen(false)}
          activeLayer={activeLayer}
          onLayerChange={handleLayerChange}
          onSearch={handleSearch}
        />
        <RightSidePanel 
          isOpen={rightPanelOpen} 
          onClose={() => setRightPanelOpen(false)}
          selectedPoint={selectedPoint}
        />
        <BottomPanel />
        <FloatingInsightsButton />
      </div>
    </div>
  );
};

export default WeatherMap;