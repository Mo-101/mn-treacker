import React, { useEffect } from 'react';

const WindParticleLayer = ({ map }) => {
  useEffect(() => {
    if (!map?.current || !map.current.loaded()) {
      return;
    }

    const initializeWindLayer = () => {
      // Remove existing layer and source if they exist
      if (map.current.getLayer('wind-layer')) {
        map.current.removeLayer('wind-layer');
      }
      if (map.current.getSource('wind-data')) {
        map.current.removeSource('wind-data');
      }

      // Add the new raster-array source
      map.current.addSource('wind-data', {
        type: 'raster-array',
        url: 'mapbox://mapbox.wind-speed',
        tileSize: 256
      });

      // Add the wind layer with new styling options
      map.current.addLayer({
        id: 'wind-layer',
        type: 'raster',
        source: 'wind-data',
        'source-layer': 'wind-speed',
        slot: 'top',
        paint: {
          'raster-opacity': 0.75,
          'raster-color-range': [0, 30], // Wind speed range in m/s
          'raster-color': [
            'interpolate',
            ['linear'],
            ['raster-value'],
            0, 'rgba(0,0,255,0)',
            5, 'rgba(0,255,255,0.5)',
            10, 'rgba(0,255,0,0.7)',
            15, 'rgba(255,255,0,0.8)',
            20, 'rgba(255,165,0,0.9)',
            25, 'rgba(255,0,0,1)'
          ],
          'raster-resampling': 'linear',
          'raster-fade-duration': 0
        }
      });
    };

    // Initialize the layer when the map is loaded
    if (map.current.loaded()) {
      initializeWindLayer();
    } else {
      map.current.on('load', initializeWindLayer);
    }

    // Cleanup
    return () => {
      if (map.current && map.current.loaded()) {
        if (map.current.getLayer('wind-layer')) {
          map.current.removeLayer('wind-layer');
        }
        if (map.current.getSource('wind-data')) {
          map.current.removeSource('wind-data');
        }
      }
    };
  }, [map]);

  return null;
};

export default WindParticleLayer;