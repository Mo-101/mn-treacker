import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import WeatherControls from './WeatherControls';
import WeatherDisplay from './WeatherDisplay';
import StreamingWeatherData from './StreamingWeatherData';
import NewsScroll from './NewsScroll';
import MapLegend from './MapLegend';
import { toggleLayer } from './MapLayers';
import { fetchWeatherData } from '../utils/weatherApiUtils';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('load', () => {
      console.log('Map loaded');
      // Add default layers
      const defaultLayers = ['temperature', 'precipitation', 'clouds', 'wind'];
      defaultLayers.forEach(layer => {
        toggleLayer(map.current, layer, true);
        setActiveLayers(prev => [...prev, layer]);
      });
    });

    return () => map.current && map.current.remove();
  }, []);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const data = await fetchWeatherData(mapState.lat, mapState.lng);
        setWeatherData(data);
        toast({
          title: "Weather Data Updated",
          description: "Latest weather information loaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch weather data",
          variant: "destructive",
        });
      }
    };

    getWeatherData();
    const interval = setInterval(getWeatherData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [mapState.lat, mapState.lng]);

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      const isLayerActive = prev.includes(layerId);
      const newLayers = isLayerActive
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId];
      
      if (map.current) {
        toggleLayer(map.current, layerId, !isLayerActive);
      }
      
      return newLayers;
    });
  };

  const handleOpacityChange = (layerId, opacity) => {
    setLayerOpacity(opacity);
    if (map.current && map.current.getLayer(layerId)) {
      map.current.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="absolute inset-0 pointer-events-none">
        <TopNavigationBar 
          onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
          className="pointer-events-auto"
        />
        
        <LeftSidePanel
          isOpen={leftPanelOpen}
          onClose={() => setLeftPanelOpen(false)}
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          onOpacityChange={handleOpacityChange}
          className="pointer-events-auto"
        />

        <WeatherControls
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          layerOpacity={layerOpacity}
          onOpacityChange={handleOpacityChange}
          className="pointer-events-auto"
        />

        <WeatherDisplay
          activeLayer={activeLayers[0]}
          onLayerChange={handleLayerToggle}
          className="pointer-events-auto"
        />

        <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
          <StreamingWeatherData data={weatherData} />
          <NewsScroll weatherData={weatherData} />
        </div>

        <MapLegend activeLayers={activeLayers} />

        <FloatingInsightsBar className="pointer-events-auto" />
      </div>
    </div>
  );
};

export default WeatherMap;