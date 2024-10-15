import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const LassaFeverLayer = ({ map, cases }) => {
  useEffect(() => {
    if (!map || !cases) return;

    map.addSource('lassa-fever-cases', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: cases.map(caseData => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [caseData.longitude, caseData.latitude]
          },
          properties: {
            id: caseData.id,
            severity: caseData.severity
          }
        }))
      }
    });

    map.addLayer({
      id: 'lassa-fever-points',
      type: 'circle',
      source: 'lassa-fever-cases',
      paint: {
        'circle-radius': 6,
        'circle-color': [
          'match',
          ['get', 'severity'],
          'high', '#FF0000',
          'medium', '#FFA500',
          'low', '#FFFF00',
          '#FF69B4'  // default color
        ],
        'circle-opacity': 0.7
      }
    });

    return () => {
      if (map.getLayer('lassa-fever-points')) map.removeLayer('lassa-fever-points');
      if (map.getSource('lassa-fever-cases')) map.removeSource('lassa-fever-cases');
    };
  }, [map, cases]);

  return null;
};

export default LassaFeverLayer;