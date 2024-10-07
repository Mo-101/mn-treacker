import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Replace with your actual Mapbox access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(8);
  const [lat, setLat] = useState(10);
  const [zoom, setZoom] = useState(5);
  const [activeLayer, setActiveLayer] = useState('temperature');

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('load', () => {
      // Add temperature layer
      map.current.addSource('temperature', {
        type: 'raster',
        url: 'mapbox://mapbox.temperature-v2'
      });
      map.current.addLayer({
        id: 'temperature-layer',
        type: 'raster',
        source: 'temperature',
        layout: {
          visibility: 'visible'
        }
      });

      // Add wind layer
      map.current.addSource('wind', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-terrain-v2'
      });
      map.current.addLayer({
        id: 'wind-layer',
        type: 'line',
        source: 'wind',
        'source-layer': 'contour',
        layout: {
          visibility: 'none',
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff69b4',
          'line-width': 1
        }
      });

      // Add precipitation layer
      map.current.addSource('precipitation', {
        type: 'raster',
        url: 'mapbox://mapbox.precipitation-v1'
      });
      map.current.addLayer({
        id: 'precipitation-layer',
        type: 'raster',
        source: 'precipitation',
        layout: {
          visibility: 'none'
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const handleLayerChange = (value) => {
    setActiveLayer(value);
    ['temperature-layer', 'wind-layer', 'precipitation-layer'].forEach(layer => {
      map.current.setLayoutProperty(
        layer,
        'visibility',
        layer === `${value}-layer` ? 'visible' : 'none'
      );
    });
  };

  const handleSearch = () => {
    // This is where your AI implementation for rat spotting would go
    console.log('Searching for Mastomys natalensis...');
    // For demonstration, let's add a marker at a random location in Nigeria
    const marker = new mapboxgl.Marker()
      .setLngLat([7 + Math.random() * 2, 9 + Math.random() * 2])
      .addTo(map.current);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      <div ref={mapContainer} className="absolute top-0 right-0 left-0 bottom-0" />
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg">
        <div className="mb-2">
          <Select value={activeLayer} onValueChange={handleLayerChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select layer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="temperature">Temperature</SelectItem>
              <SelectItem value="wind">Wind</SelectItem>
              <SelectItem value="precipitation">Precipitation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Input placeholder="Search for rat sightings..." />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded shadow">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
  );
};

export default WeatherMap;