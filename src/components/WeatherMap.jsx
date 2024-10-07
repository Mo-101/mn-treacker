import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import MapControls from './MapControls';
import { initializeMap, addMapLayers, updateMapState } from '../utils/mapUtils';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayer, setActiveLayer] = useState('default');
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

  const handleSearch = () => {
    try {
      console.log('Searching for Mastomys natalensis...');
      new mapboxgl.Marker()
        .setLngLat([7 + Math.random() * 2, 9 + Math.random() * 2])
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
    <div className="relative w-full h-[calc(100vh-64px)]">
      <div ref={mapContainer} className="absolute top-0 right-0 left-0 bottom-0" />
      <MapControls
        activeLayer={activeLayer}
        onLayerChange={handleLayerChange}
        onSearch={handleSearch}
      />
      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded shadow">
        Longitude: {mapState.lng} | Latitude: {mapState.lat} | Zoom: {mapState.zoom}
      </div>
    </div>
  );
};

export default WeatherMap;