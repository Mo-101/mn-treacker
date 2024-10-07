import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import WeatherDisplay from './WeatherDisplay';
import RatTracker from './RatTracker';
import { initializeMap, addMapLayers, updateMapState } from '../utils/mapUtils';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayer, setActiveLayer] = useState('default');
  const { toast } = useToast();
  const [ratSightings, setRatSightings] = useState([]);

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

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/predict?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setRatSightings(data.predictions);
      
      // Add markers for each prediction
      data.predictions.forEach(prediction => {
        new mapboxgl.Marker()
          .setLngLat([prediction.longitude, prediction.latitude])
          .addTo(map.current);
      });

      toast({
        title: "Search Complete",
        description: `Found ${data.predictions.length} potential rat sightings.`,
      });
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
    <div className="relative w-full h-[calc(100vh-64px)] bg-gradient-to-br from-blue-900 to-purple-900">
      <div ref={mapContainer} className="absolute top-0 right-0 left-0 bottom-0" />
      <WeatherDisplay activeLayer={activeLayer} onLayerChange={handleLayerChange} onSearch={handleSearch} />
      <RatTracker sightings={ratSightings} />
      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded shadow text-white">
        Longitude: {mapState.lng} | Latitude: {mapState.lat} | Zoom: {mapState.zoom}
      </div>
    </div>
  );
};

export default WeatherMap;