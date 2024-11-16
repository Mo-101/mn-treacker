import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const PredictionLayer = ({ map, predictions }) => {
  useEffect(() => {
    if (!map || !predictions) return;

    // Add prediction layer source
    map.addSource('predictions', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: predictions.map(pred => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [pred.longitude, pred.latitude]
          },
          properties: {
            probability: pred.probability,
            timestamp: pred.timestamp
          }
        }))
      }
    });

    // Add heatmap layer
    map.addLayer({
      id: 'predictions-heat',
      type: 'heatmap',
      source: 'predictions',
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'probability'],
          0, 0,
          1, 1
        ],
        'heatmap-intensity': 1,
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
        'heatmap-radius': 30,
        'heatmap-opacity': 0.8
      }
    });

    return () => {
      if (map.getLayer('predictions-heat')) map.removeLayer('predictions-heat');
      if (map.getSource('predictions')) map.removeSource('predictions');
    };
  }, [map, predictions]);

  return null;
};

export default PredictionLayer;