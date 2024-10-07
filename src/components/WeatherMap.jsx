import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import BottomPanel from './BottomPanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import { initializeMap, addMapLayers, updateMapState } from '../utils/mapUtils';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 20, lat: 0, zoom: 3.5 }); // Centered on Africa
  const [activeLayer, setActiveLayer] = useState('default');
  const [ratSightings, setRatSightings] = useState([]);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);

  useEffect(() => {
    if (map.current) return;
    initializeMap(mapContainer, map, mapState, setMapState, addCustomLayers, updateMapState, toast);
  }, []);

  const addCustomLayers = (map) => {
    map.on('load', () => {
      // Add wind layer
      map.addSource('raster-array-source', {
        type: 'raster-array',
        url: 'mapbox://rasterarrayexamples.gfs-winds',
        tileSize: 512
      });
      map.addLayer({
        id: 'wind-layer',
        type: 'raster-particle',
        source: 'raster-array-source',
        'source-layer': '10winds',
        paint: {
          'raster-particle-speed-factor': 0.4,
          'raster-particle-fade-opacity-factor': 0.9,
          'raster-particle-reset-rate-factor': 0.4,
          'raster-particle-count': 4000,
          'raster-particle-max-speed': 40,
          'raster-particle-color': [
            'interpolate',
            ['linear'],
            ['raster-particle-speed'],
            1.5, 'rgba(134,163,171,256)',
            2.5, 'rgba(126,152,188,256)',
            4.12, 'rgba(110,143,208,256)',
            4.63, 'rgba(110,143,208,256)',
            6.17, 'rgba(15,147,167,256)',
            7.72, 'rgba(15,147,167,256)',
            9.26, 'rgba(57,163,57,256)',
            10.29, 'rgba(57,163,57,256)',
            11.83, 'rgba(194,134,62,256)',
            13.37, 'rgba(194,134,63,256)',
            14.92, 'rgba(200,66,13,256)',
            16.46, 'rgba(200,66,13,256)',
            18.0, 'rgba(210,0,50,256)',
            20.06, 'rgba(215,0,50,256)',
            21.6, 'rgba(175,80,136,256)',
            23.66, 'rgba(175,80,136,256)',
            25.21, 'rgba(117,74,147,256)',
            27.78, 'rgba(117,74,147,256)',
            30.34, 'rgba(117,74,147,256)',
            32.4, 'rgba(117,74,147,256)',
            34.46, 'rgba(117,74,147,256)',
            36.51, 'rgba(117,74,147,256)',
            38.57, 'rgba(117,74,147,256)',
            40.63, 'rgba(117,74,147,256)',
            42.68, 'rgba(117,74,147,256)',
            44.74, 'rgba(117,74,147,256)',
            46.8, 'rgba(117,74,147,256)',
            48.85, 'rgba(117,74,147,256)',
            50.91, 'rgba(117,74,147,256)',
            52.97, 'rgba(117,74,147,256)',
            55.02, 'rgba(117,74,147,256)',
            57.08, 'rgba(117,74,147,256)',
            59.14, 'rgba(117,74,147,256)',
            61.19, 'rgba(117,74,147,256)',
            63.25, 'rgba(117,74,147,256)',
            65.31, 'rgba(117,74,147,256)',
            67.36, 'rgba(117,74,147,256)',
            69.42, 'rgba(117,74,147,256)',
            71.48, 'rgba(117,74,147,256)',
            73.53, 'rgba(117,74,147,256)',
            75.59, 'rgba(117,74,147,256)',
            77.65, 'rgba(117,74,147,256)',
            79.7, 'rgba(117,74,147,256)',
            81.76, 'rgba(117,74,147,256)',
            83.82, 'rgba(117,74,147,256)',
            85.87, 'rgba(117,74,147,256)',
            87.93, 'rgba(117,74,147,256)',
            89.99, 'rgba(117,74,147,256)',
            92.04, 'rgba(117,74,147,256)',
            94.1, 'rgba(117,74,147,256)',
            96.16, 'rgba(117,74,147,256)',
            98.21, 'rgba(117,74,147,256)',
            100.27, 'rgba(117,74,147,256)',
            102.33, 'rgba(117,74,147,256)',
            104.38, 'rgba(117,74,147,256)',
            106.44, 'rgba(117,74,147,256)'
          ]
        }
      });

      // Add vegetation layer
      map.addSource('vegetation-source', {
        type: 'raster',
        url: 'mapbox://mapbox.satellite'  // Using satellite imagery as a placeholder for vegetation
      });
      map.addLayer({
        id: 'vegetation-layer',
        type: 'raster',
        source: 'vegetation-source',
        paint: {
          'raster-opacity': 0.5
        }
      });

      // Add animated precipitation layer
      map.addSource('precipitation-source', {
        type: 'image',
        url: 'https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif',
        coordinates: [
          [-80.425, 46.437],
          [-71.516, 46.437],
          [-71.516, 37.936],
          [-80.425, 37.936]
        ]
      });
      map.addLayer({
        id: 'precipitation-layer',
        type: 'raster',
        source: 'precipitation-source',
        paint: {
          'raster-fade-duration': 0
        }
      });
    });

    // Add other map layers
    addMapLayers(map);
  };

  useEffect(() => {
    if (!map.current) return;

    const toggleLayer = (layerId, visibility) => {
      if (map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, 'visibility', visibility);
      }
    };

    const layers = ['temperature', 'vegetation', 'precipitation', 'wind', 'clouds', 'radar', 'wind-layer', 'vegetation-layer', 'precipitation-layer'];
    layers.forEach(layer => toggleLayer(`${layer}`, 'none'));

    if (activeLayer !== 'default') {
      toggleLayer(`${activeLayer}`, 'visible');
    }

    const baseStyle = activeLayer === 'temperature' 
      ? 'mapbox://styles/akanimo1/cld5h233p000q01qat06k4qw7'
      : 'mapbox://styles/mapbox/dark-v10';

    map.current.setStyle(baseStyle);
  }, [activeLayer]);

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
  };

  const handleSearch = async (query) => {
    try {
      console.log('Searching for Mastomys natalensis:', query);
      // Simulating an API call
      const response = await fetch(`https://api.example.com/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // For demonstration, we'll use random coordinates within Africa
      const newSighting = {
        latitude: -35 + Math.random() * 70, // Roughly covers Africa's latitude range
        longitude: -20 + Math.random() * 70, // Roughly covers Africa's longitude range
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

  return (
    <div className="relative w-full h-screen flex flex-col bg-black text-white">
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
      />
      <div className="flex-grow relative">
        <div ref={mapContainer} className="absolute inset-0" />
        <AnimatePresence>
          {leftPanelOpen && (
            <LeftSidePanel 
              isOpen={leftPanelOpen} 
              onClose={() => setLeftPanelOpen(false)}
              activeLayer={activeLayer}
              onLayerChange={handleLayerChange}
              onSearch={handleSearch}
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
        <BottomPanel />
      </div>
      <FloatingInsightsBar />
      <AnimatePresence>
        {aiTrainingOpen && (
          <AITrainingInterface
            isOpen={aiTrainingOpen}
            onClose={() => setAiTrainingOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherMap;