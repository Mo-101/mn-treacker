import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import WeatherLayer from './WeatherLayer';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState([]);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(0.8);

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
    });

    return () => map.current && map.current.remove();
  }, []);

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      const isLayerActive = prev.includes(layerId);
      const newLayers = isLayerActive
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId];
      
      toast({
        title: `${layerId.charAt(0).toUpperCase() + layerId.slice(1)} Layer`,
        description: isLayerActive ? "Layer disabled" : "Layer enabled",
      });
      
      return newLayers;
    });
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {map.current && (
        <>
          <WeatherLayer
            map={map.current}
            layerType="temperature"
            visible={activeLayers.includes('temperature')}
            opacity={layerOpacity}
          />
          <WeatherLayer
            map={map.current}
            layerType="precipitation"
            visible={activeLayers.includes('precipitation')}
            opacity={layerOpacity}
          />
          <WeatherLayer
            map={map.current}
            layerType="wind"
            visible={activeLayers.includes('wind')}
            opacity={layerOpacity}
          />
          <WeatherLayer
            map={map.current}
            layerType="clouds"
            visible={activeLayers.includes('clouds')}
            opacity={layerOpacity}
          />
        </>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <TopNavigationBar 
            onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
          />
        </div>
        
        <LeftSidePanel
          isOpen={leftPanelOpen}
          onClose={() => setLeftPanelOpen(false)}
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          onOpacityChange={handleOpacityChange}
          layers={['temperature', 'precipitation', 'wind', 'clouds']}
        />

        <div className="pointer-events-auto">
          <FloatingInsightsBar />
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;