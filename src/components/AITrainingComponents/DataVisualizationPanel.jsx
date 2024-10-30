import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { hybridMapStyle } from '../../config/mapStyle';

const DataVisualizationPanel = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: hybridMapStyle,
      center: [27.12657, 3.46732],
      zoom: 2,
      pitch: 45,
      bearing: 0,
      antialias: true
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-black/40 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-yellow-400">Data Visualization</h3>
      <div ref={mapContainer} className="w-full h-[400px] rounded-lg overflow-hidden" />
    </div>
  );
};

export default DataVisualizationPanel;