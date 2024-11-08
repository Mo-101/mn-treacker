import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useQuery } from '@tanstack/react-query';
import { fetchLassaFeverCases } from '../utils/api';
import { useToast } from './ui/use-toast';

const LassaFeverCasesLayer = ({ map }) => {
  const { toast } = useToast();
  const { data: points } = useQuery({
    queryKey: ['lassa-cases'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000,
    retry: 1,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch Lassa fever cases",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (!map || !points?.features) return;

    if (map.getLayer('lassa-points')) map.removeLayer('lassa-points');
    if (map.getSource('lassa-points')) map.removeSource('lassa-points');

    map.addSource('lassa-points', {
      type: 'geojson',
      data: points
    });

    map.addLayer({
      id: 'lassa-points',
      type: 'circle',
      source: 'lassa-points',
      paint: {
        'circle-radius': 6,
        'circle-color': '#FF3B3B',  // Red color for Lassa fever cases
        'circle-opacity': 0.8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    });

    // Add popup for Lassa fever cases
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('mouseenter', 'lassa-points', (e) => {
      map.getCanvas().style.cursor = 'pointer';
      
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      
      popup
        .setLngLat(coordinates)
        .setHTML(`
          <div class="bg-black/90 p-3 rounded-lg text-white">
            <h3 class="font-bold text-red-400">Lassa Fever Case</h3>
            <p>Severity: ${properties.severity || 'Unknown'}</p>
            <p>Date: ${new Date(properties.report_date).toLocaleDateString()}</p>
            <p>Patient Age: ${properties.patient_age || 'Unknown'}</p>
          </div>
        `)
        .addTo(map);
    });

    map.on('mouseleave', 'lassa-points', () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    return () => {
      if (map.getLayer('lassa-points')) map.removeLayer('lassa-points');
      if (map.getSource('lassa-points')) map.removeSource('lassa-points');
    };
  }, [map, points]);

  return null;
};

export default LassaFeverCasesLayer;