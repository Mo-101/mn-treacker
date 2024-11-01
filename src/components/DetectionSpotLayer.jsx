import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from './ui/use-toast';

const DetectionSpotLayer = ({ map, detections }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!map || !detections) return;

    const addLayers = () => {
      try {
        // Wait for map style to be loaded
        if (!map.isStyleLoaded()) {
          map.once('style.load', addLayers);
          return;
        }

        // Safely remove existing layers
        ['detection-glow-outer', 'detection-glow-inner', 'detection-center'].forEach(layerId => {
          if (map.getStyle().layers.find(layer => layer.id === layerId)) {
            map.removeLayer(layerId);
          }
        });

        // Remove existing source if it exists
        if (map.getSource('detection-points')) {
          map.removeSource('detection-points');
        }

        // Add the detection points source
        map.addSource('detection-points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: detections.map(detection => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: detection.coordinates || [detection.longitude, detection.latitude]
              },
              properties: {
                species: detection.species || 'Mastomys natalensis',
                confidence: detection.confidence || 95,
                timestamp: detection.timestamp || new Date().toISOString()
              }
            }))
          }
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
      } catch (error) {
        console.error('Error adding detection layers:', error);
      }
    };

    addLayers();

    return () => {
      if (!map || !map.getStyle()) return;
      
      ['detection-glow-outer', 'detection-glow-inner', 'detection-center'].forEach(layerId => {
        if (map.getStyle().layers.find(layer => layer.id === layerId)) {
          map.removeLayer(layerId);
        }
      });
      
      if (map.getSource('detection-points')) {
        map.removeSource('detection-points');
      }
    };
  }, [map, detections]);

  return null;
};

export default DetectionSpotLayer;