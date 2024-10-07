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
      const response = await fetch(`http://127.0.0.1:5000/predict?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRatSightings(data.predictions);
      
      // Remove existing markers
      if (map.current) {
        const markers = map.current.getLayer('rat-markers');
        if (markers) {
          map.current.removeLayer('rat-markers');
          map.current.removeSource('rat-markers');
        }
      }

      // Add markers for each prediction
      if (map.current && data.predictions.length > 0) {
        map.current.addSource('rat-markers', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: data.predictions.map(prediction => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [prediction.longitude, prediction.latitude]
              },
              properties: {
                description: `Confidence: ${(prediction.confidence * 100).toFixed(2)}%`
              }
            }))
          }
        });

        map.current.addLayer({
          id: 'rat-markers',
          type: 'circle',
          source: 'rat-markers',
          paint: {
            'circle-radius': 6,
            'circle-color': '#B42222'
          }
        });
      }

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
    <div className="fixed inset-0 w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <WeatherLayerToggle activeLayer={activeLayer} onLayerChange={handleLayerChange} />
      <RatDetectionPanel sightings={ratSightings} onSearch={handleSearch} />
      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded shadow text-white">
        Longitude: {mapState.lng} | Latitude: {mapState.lat} | Zoom: {mapState.zoom}
      </div>
    </div>
  );
};

export default WeatherMap;