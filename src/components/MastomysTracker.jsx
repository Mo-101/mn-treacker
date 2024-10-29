import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useRatLocations } from '../utils/dataFetchingOptimized';

const MastomysTracker = ({ map }) => {
  const { data: ratLocations, isError, isLoading } = useRatLocations();

  useEffect(() => {
    if (!map || !ratLocations || isLoading) return;

    if (!map.getSource('rat-locations')) {
      map.addSource('rat-locations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: ratLocations
        }
      });

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

      map.addLayer({
        id: 'rat-points',
        type: 'circle',
        source: 'rat-locations',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222',
          'circle-opacity': 0.7,
          'circle-radius-transition': {
            duration: 2000,
            delay: 0
          }
        }
      });

      const pulseAnimation = () => {
        const size = map.getPaintProperty('rat-points', 'circle-radius') === 6 ? 8 : 6;
        map.setPaintProperty('rat-points', 'circle-radius', size);
        requestAnimationFrame(pulseAnimation);
      };
      pulseAnimation();
    } else {
      map.getSource('rat-locations').setData({
        type: 'FeatureCollection',
        features: ratLocations
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