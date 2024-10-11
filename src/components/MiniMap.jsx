import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MiniMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [0, 0],
      zoom: 2
    });

    // Add prediction hotspots (example)
    map.current.on('load', () => {
      map.current.addSource('hotspots', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [0, 0]
              },
              properties: {
                title: 'Hotspot 1',
                risk: 'high'
              }
            }
            // Add more hotspots as needed
          ]
        }
      });

      map.current.addLayer({
        id: 'hotspots',
        type: 'circle',
        source: 'hotspots',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'risk'],
            'high', '#ff0000',
            'medium', '#ffff00',
            'low', '#00ff00',
            '#ffffff'
          ]
        }
      });
    });

    return () => map.current.remove();
  }, []);

  return <div ref={mapContainer} className="w-full h-48 mb-4" />;
};

export default MiniMap;