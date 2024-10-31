import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useQuery } from '@tanstack/react-query';
import { fetchLassaFeverCases, fetchRatData } from '../utils/api';
import { useToast } from './ui/use-toast';

const LassaFeverCasesLayer = ({ map }) => {
  const { toast } = useToast();
  const { data: cases } = useQuery({
    queryKey: ['lassaFeverCases'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000,
    retry: 1
  });

  const { data: ratLocations } = useQuery({
    queryKey: ['ratLocations'],
    queryFn: () => fetchRatData(),
    staleTime: 300000,
    retry: 1
  });

  useEffect(() => {
    if (!map) return;

    // Remove existing layers and sources
    ['lassa-cases', 'rat-locations'].forEach(layerId => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(layerId)) map.removeSource(layerId);
    });

    // Add Lassa fever cases
    if (cases?.features) {
      map.addSource('lassa-cases', {
        type: 'geojson',
        data: cases
      });

      map.addLayer({
        id: 'lassa-cases',
        type: 'circle',
        source: 'lassa-cases',
        paint: {
          'circle-radius': 8,
          'circle-color': '#FF3B3B',
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });
    }

    // Add rat locations
    if (ratLocations?.features) {
      map.addSource('rat-locations', {
        type: 'geojson',
        data: ratLocations
      });

      map.addLayer({
        id: 'rat-locations',
        type: 'circle',
        source: 'rat-locations',
        paint: {
          'circle-radius': 6,
          'circle-color': '#FFD700',
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF'
        }
      });
    }

    // Add popups for both layers
    ['lassa-cases', 'rat-locations'].forEach(layerId => {
      map.on('click', layerId, (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;
        
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div class="bg-gray-900/95 p-3 rounded-lg shadow-xl">
              <h3 class="text-amber-400 font-bold mb-2">
                ${layerId === 'lassa-cases' ? 'Lassa Fever Case' : 'Rat Sighting'}
              </h3>
              <div class="space-y-1 text-white">
                ${Object.entries(properties)
                  .map(([key, value]) => `<p><span class="text-amber-400">${key}:</span> ${value}</p>`)
                  .join('')}
              </div>
            </div>
          `)
          .addTo(map);
      });

      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => {
      ['lassa-cases', 'rat-locations'].forEach(layerId => {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(layerId)) map.removeSource(layerId);
      });
    };
  }, [map, cases, ratLocations]);

  return null;
};

export default LassaFeverCasesLayer;