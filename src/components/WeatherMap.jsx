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
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);

  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('style.load', () => {
      setIsStyleLoaded(true);
      console.log('Map style loaded');
    });

    return () => map.current && map.current.remove();
  }, []);

  useEffect(() => {
    if (!isStyleLoaded || !map.current) return;

    try {
      if (!map.current.getSource('raster-array-source')) {
        map.current.addSource('raster-array-source', {
          type: 'raster-array',
          url: 'mapbox://rasterarrayexamples.gfs-winds',
          tileSize: 512
        });

        map.current.addLayer({
          id: 'wind-layer',
          type: 'raster-particle',
          source: 'raster-array-source',
          'source-layer': '10winds',
          layout: { visibility: 'none' },
          paint: {
            'raster-particle-speed-factor': 0.4,
            'raster-particle-fade-opacity-factor': 0.9,
            'raster-particle-reset-rate-factor': 0.4,
            'raster-particle-count': 4000,
            'raster-particle-max-speed': 40,
            'raster-particle-color': [
              'interpolate',
              ['linear'],
              ['raster-particle-speed'],
              1.5, 'rgba(134,163,171,1)',
              2.5, 'rgba(126,152,188,1)',
              4.12, 'rgba(110,143,208,1)',
              6.17, 'rgba(15,147,167,1)',
              9.26, 'rgba(57,163,57,1)',
              11.83, 'rgba(194,134,62,1)',
              14.92, 'rgba(200,66,13,1)',
              18.0, 'rgba(210,0,50,1)',
              21.6, 'rgba(175,80,136,1)',
              25.21, 'rgba(117,74,147,1)',
              29.32, 'rgba(68,105,141,1)',
              33.44, 'rgba(194,251,119,1)',
              43.72, 'rgba(241,255,109,1)',
              50.41, 'rgba(255,255,255,1)',
              59.16, 'rgba(0,255,255,1)',
              69.44, 'rgba(255,37,255,1)'
            ]
          }
        });

        console.log('Wind layer added successfully');
      }
    } catch (error) {
      console.error('Error adding wind layer:', error);
      toast({
        title: "Error",
        description: "Failed to initialize wind layer",
        variant: "destructive",
      });
    }
  }, [isStyleLoaded]);

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      const isLayerActive = prev.includes(layerId);
      const newLayers = isLayerActive
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId];
      
      if (map.current) {
        const visibility = isLayerActive ? 'none' : 'visible';
        if (layerId === 'wind') {
          map.current.setLayoutProperty('wind-layer', 'visibility', visibility);
        } else if (map.current.getLayer(layerId)) {
          map.current.setLayoutProperty(layerId, 'visibility', visibility);
        }
        
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