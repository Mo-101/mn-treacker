import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { hybridMapStyle } from '../config/mapStyle';

const MiniMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: hybridMapStyle,
      center: [27.12657, 3.46732],
      zoom: 1.5,
      interactive: false
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapContainer} className="w-full h-48 rounded-lg overflow-hidden" />
  );
};

export default MiniMap;