import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import WeatherLayerToggle from './WeatherLayerToggle';
import RatDetectionPanel from './RatDetectionPanel';
import { initializeMap, addMapLayers, updateMapState } from '../utils/mapUtils';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayer, setActiveLayer] = useState('default');
  const [ratSightings, setRatSightings] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return;
    initializeMap(mapContainer, map, mapState, setMapState, addMapLayers, updateMapState, toast);
  }, []);

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
    ['default', 'temperature', 'wind', 'precipitation'].forEach(l => {
      if (l === 'default') {
        map.current.setStyle(l === layer ? 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m' : 'mapbox://styles/mapbox/light-v10');
      } else if (l === 'temperature') {
        map.current.setStyle(l === layer ? 'mapbox://styles/akanimo1/cm1xrp15a015001qr2z1d54sd' : 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m');
      } else {
        map.current.setLayoutProperty(
          `${l}-layer`,
          'visibility',
          l === layer ? 'visible' : 'none'
        );
      }
    });
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

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      <WeatherLayerToggle
        activeLayer={activeLayer}
        onLayerChange={handleLayerChange}
      />
      <RatDetectionPanel
        sightings={ratSightings}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default WeatherMap;