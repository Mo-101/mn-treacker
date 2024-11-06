import React, { useEffect } from 'react';
import { useToast } from './ui/use-toast';

const WindParticleLayer = ({ map }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!map) return;

    try {
      map.on('load', () => {
        if (!map.getSource('raster-array-source')) {
          map.addSource('raster-array-source', {
            type: 'raster-array',
            url: 'mapbox://rasterarrayexamples.gfs-winds',
            tileSize: 512
          });
        }

        if (!map.getLayer('wind-layer')) {
          map.addLayer({
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
                2.5, 'rgba(126,152,188,256)',
                4.12, 'rgba(110,143,208,256)',
                4.63, 'rgba(110,143,208,256)',
                6.17, 'rgba(15,147,167,256)',
                7.72, 'rgba(15,147,167,256)'
              ]
            }
          });
        }
      });
    } catch (error) {
      console.error('Error initializing wind particle layer:', error);
      toast({
        title: "Error",
        description: "Failed to initialize wind visualization",
        variant: "destructive",
      });
    }

    return () => {
      if (map.getLayer('wind-layer')) {
        map.removeLayer('wind-layer');
      }
      if (map.getSource('raster-array-source')) {
        map.removeSource('raster-array-source');
      }
    };
  }, [map]);

  return null;
};

export default WindParticleLayer;