import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LayerControls from './LayerControls';
import WeatherLayer from './WeatherLayer';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState(['precipitation', 'temp_new', 'clouds_new', 'wind_new']);
  const [layerOpacity, setLayerOpacity] = useState(80);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);

  const layers = [
    { id: 'precipitation', name: 'Precipitation' },
    { id: 'temp_new', name: 'Temperature' },
    { id: 'clouds_new', name: 'Clouds' },
    { id: 'wind_new', name: 'Wind' }
  ];

  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('load', () => {
      toast({
        title: "Weather Map Loaded",
        description: "All weather layers are now visible",
      });
    });

    return () => map.current?.remove();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {layers.map((layer) => (
        <WeatherLayer
          key={layer.id}
          map={map.current}
          layerType={layer.id}
          visible={true}
          opacity={layerOpacity / 100}
        />
      ))}
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <TopNavigationBar 
            onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
          />
        </div>
        
        {leftPanelOpen && (
          <div className="absolute left-4 top-20 pointer-events-auto">
            <LayerControls
              layers={layers}
              activeLayers={activeLayers}
              setActiveLayers={setActiveLayers}
              layerOpacity={layerOpacity}
              setLayerOpacity={setLayerOpacity}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherMap;