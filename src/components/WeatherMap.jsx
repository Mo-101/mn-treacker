import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import TopNavigationBar from './TopNavigationBar';
import FloatingInsightsBar from './FloatingInsightsButton';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
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

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <TopNavigationBar />
      </div>
      
      <div className="flex-grow relative">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
      
      <div className="flex-shrink-0 bg-white p-4 shadow-lg">
        <p>Longitude: {mapState.lng} | Latitude: {mapState.lat} | Zoom: {mapState.zoom}</p>
      </div>

      <FloatingInsightsBar />
    </div>
  );
};

export default WeatherMap;