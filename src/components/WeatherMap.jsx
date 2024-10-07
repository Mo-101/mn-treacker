import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayer, setActiveLayer] = useState('temperature');
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return;
    initializeMap();
  }, []);

  const initializeMap = () => {
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom
      });

      map.current.on('load', addMapLayers);
      map.current.on('move', updateMapState);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const addMapLayers = () => {
    addLayer('temperature', 'raster', 'mapbox://styles/akanimo1/cm1xrp15a015001qr2z1d54sd');
    addLayer('wind', 'vector', 'mapbox://mapbox.mapbox-terrain-v2', 'contour');
    addLayer('precipitation', 'raster', 'mapbox://mapbox.precipitation-v1');
  };

  const addLayer = (name, type, url, sourceLayer = null) => {
    if (name === 'temperature') {
      map.current.setStyle(url);
    } else {
      map.current.addSource(name, { type, url });
      map.current.addLayer({
        id: `${name}-layer`,
        type: type === 'vector' ? 'line' : 'raster',
        source: name,
        'source-layer': sourceLayer,
        layout: { visibility: name === activeLayer ? 'visible' : 'none' },
        paint: type === 'vector' ? {
          'line-color': '#ff69b4',
          'line-width': 1
        } : undefined
      });
    }
  };

  const updateMapState = () => {
    const center = map.current.getCenter();
    setMapState({
      lng: center.lng.toFixed(4),
      lat: center.lat.toFixed(4),
      zoom: map.current.getZoom().toFixed(2)
    });
  };

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
    ['temperature', 'wind', 'precipitation'].forEach(l => {
      if (l === 'temperature') {
        map.current.setStyle(l === layer ? 'mapbox://styles/akanimo1/cm1xrp15a015001qr2z1d54sd' : 'mapbox://styles/mapbox/light-v10');
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
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg flex flex-col space-y-2">
        <Button 
          onClick={() => handleLayerChange('temperature')}
          variant={activeLayer === 'temperature' ? 'default' : 'outline'}
        >
          Temperature
        </Button>
        <Button 
          onClick={() => handleLayerChange('wind')}
          variant={activeLayer === 'wind' ? 'default' : 'outline'}
        >
          Wind
        </Button>
        <Button 
          onClick={() => handleLayerChange('precipitation')}
          variant={activeLayer === 'precipitation' ? 'default' : 'outline'}
        >
          Precipitation
        </Button>
        <div className="flex space-x-2 mt-4">
          <Input placeholder="Search for rat sightings..." />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded shadow">
        Longitude: {mapState.lng} | Latitude: {mapState.lat} | Zoom: {mapState.zoom}
      </div>
    </div>
  );
};

export default WeatherMap;