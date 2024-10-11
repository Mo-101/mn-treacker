import React, { useEffect, useState } from 'react';

const MastomysTracker = ({ data, map }) => {
  const [isLayerAdded, setIsLayerAdded] = useState(false);

  useEffect(() => {
    if (!map || data.length === 0 || isLayerAdded) return;

    // Remove existing layers and sources
    if (map.getLayer('mastomys-heat')) map.removeLayer('mastomys-heat');
    if (map.getLayer('mastomys-point')) map.removeLayer('mastomys-point');
    if (map.getSource('mastomys')) map.removeSource('mastomys');

    // Add new source and layers
    map.addSource('mastomys', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: data.map(point => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.lng, point.lat]
          },
          properties: {
            population: point.population
          }
        }))
      }
    });

    map.addLayer({
      id: 'mastomys-heat',
      type: 'heatmap',
      source: 'mastomys',
      maxzoom: 15,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'population'],
          0, 0,
          500, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          15, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          15, 20
        ],
        'heatmap-opacity': 0.8
      }
    });

    map.addLayer({
      id: 'mastomys-point',
      type: 'circle',
      source: 'mastomys',
      minzoom: 14,
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          14, 4,
          22, 20
        ],
        'circle-color': '#FF0000',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#FFFFFF'
      }
    });

    setIsLayerAdded(true);
  }, [data, map, isLayerAdded]);

  return null; // This component doesn't render anything directly
};

export default MastomysTracker;