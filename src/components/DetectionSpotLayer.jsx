import React, { useEffect } from 'react';

const DetectionSpotLayer = ({ map, detections }) => {
  useEffect(() => {
    if (!map || !detections) return;

    const addLayer = () => {
      if (!map.isStyleLoaded()) {
        setTimeout(addLayer, 100); // Retry after 100ms
        return;
      }

      try {
        // Add source if it doesn't exist
        if (!map.getSource('detections')) {
          map.addSource('detections', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: detections?.features || []
            }
          });
        } else {
          // Update existing source
          map.getSource('detections').setData({
            type: 'FeatureCollection',
            features: detections?.features || []
          });
        }

        // Add layer if it doesn't exist
        if (!map.getLayer('detection-points')) {
          map.addLayer({
            id: 'detection-points',
            type: 'circle',
            source: 'detections',
            paint: {
              'circle-radius': 6,
              'circle-color': '#FF0000',
              'circle-opacity': 0.7
            }
          });
        }
      } catch (error) {
        console.error('Error adding detection layer:', error);
      }
    };

    addLayer();

    return () => {
      if (map && map.getLayer('detection-points')) {
        map.removeLayer('detection-points');
      }
      if (map && map.getSource('detections')) {
        map.removeSource('detections');
      }
    };
  }, [map, detections]);

  return null;
};

export default DetectionSpotLayer;