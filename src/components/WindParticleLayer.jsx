import React, { useEffect } from 'react';

const WindParticleLayer = ({ map }) => {
  useEffect(() => {
    if (!map?.current || !map.current.loaded()) {
      return;
    }

    const addWindLayer = () => {
      // Check if source already exists
      if (!map.current.getSource('raster-array-source')) {
        map.current.addSource('raster-array-source', {
          type: 'raster-array',
          url: 'mapbox://rasterarrayexamples.gfs-winds',
          tileSize: 512,
        });
      }

      // Check if layer already exists
      if (!map.current.getLayer('wind-layer')) {
        map.current.addLayer({
          id: 'wind-layer',
          type: 'raster-particle',
          source: 'raster-array-source',
          'source-layer': '10winds',
          paint: {
            'raster-particle-speed-factor': 0.4,
            'raster-particle-fade-opacity-factor': 0.9,
            'raster-particle-reset-rate-factor': 0.4,
            'raster-particle-count': 4000,
            'raster-particle-max-speed': 40,
            'raster-particle-color': [
              'interpolate',
              ['linear'],
              ['raster-particle-speed'],
              1.5, 'rgba(134,163,171,256)',
              4.12, 'rgba(110,143,208,256)',
              7.72, 'rgba(15,147,167,256)',
              11.83, 'rgba(194,134,62,256)',
              16.46, 'rgba(200,66,13,256)',
              21.6, 'rgba(175,80,136,256)',
              33.44, 'rgba(194,251,119,256)',
              50.41, 'rgba(256,256,256,256)',
              59.16, 'rgba(0,256,256,256)',
            ],
          },
        });
      }
    };

    // Add layer when map is loaded
    if (map.current.loaded()) {
      addWindLayer();
    } else {
      map.current.on('load', addWindLayer);
    }

    // Cleanup
    return () => {
      if (map.current && map.current.loaded()) {
        if (map.current.getLayer('wind-layer')) {
          map.current.removeLayer('wind-layer');
        }
        if (map.current.getSource('raster-array-source')) {
          map.current.removeSource('raster-array-source');
        }
      }
    };
  }, [map]);

  return null;
};

export default WindParticleLayer;