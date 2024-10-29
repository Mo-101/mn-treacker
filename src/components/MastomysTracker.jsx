import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useRatDetections } from '../utils/dataApi';

const MastomysTracker = ({ map }) => {
  const { data: ratLocations, isLoading, error } = useRatDetections();

  useEffect(() => {
    if (!map || !ratLocations || isLoading) return;

    if (!map.getSource('rat-locations')) {
      map.addSource('rat-locations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: ratLocations.map(location => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: location.coordinates
            },
            properties: {
              timestamp: location.timestamp,
              confidence: location.confidence
            }
          }))
        }
      });

      // Add glow effect layer
      map.addLayer({
        id: 'rat-points-glow',
        type: 'circle',
        source: 'rat-locations',
        paint: {
          'circle-radius': 15,
          'circle-color': '#B42222',
          'circle-opacity': 0.15,
          'circle-blur': 1
        }
      });

      // Add main point layer
      map.addLayer({
        id: 'rat-points',
        type: 'circle',
        source: 'rat-locations',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222',
          'circle-opacity': 0.7
        }
      });

      // Add pulsing animation
      let size = 6;
      const pulseAnimation = () => {
        size = size === 6 ? 8 : 6;
        map.setPaintProperty('rat-points', 'circle-radius', size);
        requestAnimationFrame(pulseAnimation);
      };
      pulseAnimation();
    } else {
      // Update existing source
      map.getSource('rat-locations').setData({
        type: 'FeatureCollection',
        features: ratLocations.map(location => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: location.coordinates
          },
          properties: {
            timestamp: location.timestamp,
            confidence: location.confidence
          }
        }))
      });
    }

    return () => {
      if (map.getLayer('rat-points')) map.removeLayer('rat-points');
      if (map.getLayer('rat-points-glow')) map.removeLayer('rat-points-glow');
      if (map.getSource('rat-locations')) map.removeSource('rat-locations');
    };
  }, [map, ratLocations, isLoading]);

  return null;
};

export default MastomysTracker;