import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState([]);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);

  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('load', () => {
      // Add base layers
      addBaseLayers(map.current);
      console.log('Map and base layers loaded');
    });

    return () => map.current && map.current.remove();
  }, []);

  const addBaseLayers = (map) => {
    const layers = [
      {
        id: 'satellite',
        source: {
          type: 'raster',
          url: 'mapbox://mapbox.satellite'
        }
      },
      {
        id: 'terrain',
        source: {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1'
        }
      }
    ];

    layers.forEach(layer => {
      if (!map.getSource(layer.id)) {
        map.addSource(layer.id, layer.source);
        map.addLayer({
          id: layer.id,
          type: 'raster',
          source: layer.id,
          layout: { visibility: 'none' }
        });
      }
    });
  };

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      const isLayerActive = prev.includes(layerId);
      const newLayers = isLayerActive
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId];
      
      if (map.current && map.current.getLayer(layerId)) {
        const visibility = isLayerActive ? 'none' : 'visible';
        map.current.setLayoutProperty(layerId, 'visibility', visibility);
        
        toast({
          title: `${layerId.charAt(0).toUpperCase() + layerId.slice(1)} Layer`,
          description: isLayerActive ? "Layer disabled" : "Layer enabled",
        });
      }
      
      return newLayers;
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
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
        />
      </div>
    </div>
  );
};

export default WeatherMap;