import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const DetectionSpotLayer = ({ map, detections }) => {
  useEffect(() => {
    if (!map || !detections?.features) return;

    // Remove existing layers if they exist
    ['detection-glow-outer', 'detection-glow-inner', 'detection-center'].forEach(layerId => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
    });
    if (map.getSource('detection-points')) map.removeSource('detection-points');

    // Add the detection points source
    map.addSource('detection-points', {
      type: 'geojson',
      data: detections
    });

    // Add layers
    map.addLayer({
      id: 'detection-glow-outer',
      type: 'circle',
      source: 'detection-points',
      paint: {
        'circle-radius': 30,
        'circle-color': '#ff0000',
        'circle-opacity': 0.15,
        'circle-blur': 1
      }
    });

    map.addLayer({
      id: 'detection-glow-inner',
      type: 'circle',
      source: 'detection-points',
      paint: {
        'circle-radius': 20,
        'circle-color': '#ff0000',
        'circle-opacity': 0.3,
        'circle-blur': 0.5
      }
    });

    map.addLayer({
      id: 'detection-center',
      type: 'circle',
      source: 'detection-points',
      paint: {
        'circle-radius': 8,
        'circle-color': '#ff0000',
        'circle-opacity': 0.8
      }
    });

    // Add popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'detection-popup'
    });

    map.on('mouseenter', 'detection-center', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      
      popup
        .setLngLat(coordinates)
        .setHTML(`
          <div class="bg-black/90 p-3 rounded-lg text-white">
            <h3 class="font-bold text-amber-400">Detection Details</h3>
            <p>Time: ${new Date(properties.timestamp).toLocaleString()}</p>
            <p>Confidence: ${properties.confidence || 'N/A'}%</p>
          </div>
        `)
        .addTo(map);
    });

    map.on('mouseleave', 'detection-center', () => {
      popup.remove();
    });

    return () => {
      ['detection-glow-outer', 'detection-glow-inner', 'detection-center'].forEach(layerId => {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
      });
      if (map.getSource('detection-points')) map.removeSource('detection-points');
      popup.remove();
    };
  }, [map, detections]);

  return null;
};

export default DetectionSpotLayer;