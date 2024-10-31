import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useQuery } from '@tanstack/react-query';
import { fetchLassaFeverCases } from '../utils/api';
import { useToast } from './ui/use-toast';

const LassaFeverCasesLayer = ({ map }) => {
  const { toast } = useToast();
  const { data: points } = useQuery({
    queryKey: ['points'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000,
    retry: 1
  });

  useEffect(() => {
    if (!map || !points?.features) return;

    const initializeLayer = () => {
      try {
        // Remove existing layer and source
        if (map.getStyle() && map.getLayer('points')) {
          map.removeLayer('points');
        }
        if (map.getStyle() && map.getSource('points')) {
          map.removeSource('points');
        }

        // Add points source
        map.addSource('points', {
          type: 'geojson',
          data: points
        });

        // Add points layer
        map.addLayer({
          id: 'points',
          type: 'circle',
          source: 'points',
          paint: {
            'circle-radius': 6,
            'circle-color': '#FF3B3B',
            'circle-opacity': 0.9,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF'
          }
        });

        // Add popup on click
        map.on('click', 'points', (e) => {
          if (!e.features?.length) return;
          
          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;
          
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <div class="bg-gray-900/95 p-3 rounded-lg shadow-xl">
                <h3 class="text-amber-400 font-bold mb-2">Point Details</h3>
                <div class="space-y-1 text-white">
                  ${Object.entries(properties)
                    .map(([key, value]) => `<p><span class="text-amber-400">${key}:</span> ${value}</p>`)
                    .join('')}
                </div>
              </div>
            `)
            .addTo(map);
        });

        map.on('mouseenter', 'points', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'points', () => {
          map.getCanvas().style.cursor = '';
        });
      } catch (error) {
        console.error('Error initializing Lassa fever layer:', error);
      }
    };

    if (!map.loaded()) {
      map.once('load', initializeLayer);
    } else {
      initializeLayer();
    }

    return () => {
      if (!map.getStyle()) return;
      if (map.getLayer('points')) {
        map.removeLayer('points');
      }
      if (map.getSource('points')) {
        map.removeSource('points');
      }
    };
  }, [map, points]);

  return null;
};

export default LassaFeverCasesLayer;