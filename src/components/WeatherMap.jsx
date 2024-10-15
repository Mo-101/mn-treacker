import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import TopNavigationBar from './TopNavigationBar';
import FloatingInsightsBar from './FloatingInsightsButton';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import { initializeAerisMap, cleanupAerisMap } from '../utils/aerisMapUtils';
import { useToast } from './ui/use-toast';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState([]);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const aerisMap = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('move', () => {
      setMapState({
        lng: map.current.getCenter().lng.toFixed(4),
        lat: map.current.getCenter().lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2)
      });
    });

    initializeAerisMap(mapContainer.current, aerisMap, mapState, toast);

    return () => {
      if (map.current) {
        map.current.remove();
      }
      cleanupAerisMap(aerisMap);
    };
  }, []);

  const handleLayerToggle = (layerId) => {
    if (activeLayers.includes(layerId)) {
      setActiveLayers(activeLayers.filter(id => id !== layerId));
    } else {
      setActiveLayers([...activeLayers, layerId]);
    }
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
    activeLayers.forEach(layerId => {
      if (map.current.getLayer(layerId)) {
        map.current.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
      }
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <TopNavigationBar />
      </div>
      
      <div className="flex-grow relative">
        <div ref={mapContainer} className="absolute inset-0" />
        
        <LeftSidePanel
          isOpen={isLeftPanelOpen}
          onClose={() => setIsLeftPanelOpen(false)}
          activeLayers={activeLayers}
          layerOpacity={layerOpacity}
          onLayerToggle={handleLayerToggle}
          onOpacityChange={handleOpacityChange}
        />

        <RightSidePanel
          isOpen={isRightPanelOpen}
          onClose={() => setIsRightPanelOpen(false)}
          selectedPoint={selectedPoint}
        />
      </div>
      
      <div className="flex-shrink-0 bg-white p-4 shadow-lg">
        <p>Longitude: {mapState.lng} | Latitude: {mapState.lat} | Zoom: {mapState.zoom}</p>
      </div>

      <FloatingInsightsBar />
    </div>
  );
};

export default WeatherMap;
