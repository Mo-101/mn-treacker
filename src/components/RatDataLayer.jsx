import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const RatDataLayer = ({ map, ratData }) => {
  useEffect(() => {
    if (!map || !ratData) return;

    // Add rat detection layer
    map.addSource('rat-detections', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: ratData.detections.map(detection => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [detection.lng, detection.lat]
          },
          properties: {
            id: detection.id
          }
        }))
      }
    });

    map.addLayer({
      id: 'rat-detection-points',
      type: 'circle',
      source: 'rat-detections',
      paint: {
        'circle-radius': 8,
        'circle-color': '#FF0000',
        'circle-opacity': 0.7
      }
    });

    // Add rat prediction layer
    map.addSource('rat-predictions', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: ratData.predictions.map(prediction => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [prediction.lng, prediction.lat]
          },
          properties: {
            id: prediction.id,
            probability: prediction.probability
          }
        }))
      }
    });

    map.addLayer({
      id: 'rat-prediction-points',
      type: 'circle',
      source: 'rat-predictions',
      paint: {
        'circle-radius': 8,
        'circle-color': '#00FF00',
        'circle-opacity': ['interpolate', ['linear'], ['get', 'probability'], 0, 0.1, 1, 0.7]
      }
    });

    return () => {
      if (map.getLayer('rat-detection-points')) map.removeLayer('rat-detection-points');
      if (map.getLayer('rat-prediction-points')) map.removeLayer('rat-prediction-points');
      if (map.getSource('rat-detections')) map.removeSource('rat-detections');
      if (map.getSource('rat-predictions')) map.removeSource('rat-predictions');
    };
  }, [map, ratData]);

  return null;
};

export default RatDataLayer;