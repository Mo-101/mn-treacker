import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useQuery } from '@tanstack/react-query';
import { fetchMnData } from '../utils/api';
import { useToast } from './ui/use-toast';

const MnDataLayer = ({ map }) => {
  const { toast } = useToast();
  const { data: mnPoints } = useQuery({
    queryKey: ['mn-data'],
    queryFn: fetchMnData,
    staleTime: 300000,
    retry: 1,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch rat location data",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (!map || !mnPoints?.features) return;

    if (map.getLayer('mn-points')) map.removeLayer('mn-points');
    if (map.getSource('mn-points')) map.removeSource('mn-points');

    map.addSource('mn-points', {
      type: 'geojson',
      data: mnPoints
    });

    map.addLayer({
      id: 'mn-points',
      type: 'circle',
      source: 'mn-points',
      paint: {
        'circle-radius': 6,
        'circle-color': '#4CAF50',  // Green color for rat locations
        'circle-opacity': 0.8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    });

    // Add popup for rat locations
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('mouseenter', 'mn-points', (e) => {
      map.getCanvas().style.cursor = 'pointer';
      
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      
      popup
        .setLngLat(coordinates)
        .setHTML(`
          <div class="bg-black/90 p-3 rounded-lg text-white">
            <h3 class="font-bold text-green-400">Rat Location</h3>
            <p>Population: ${properties.population_size || 'Unknown'}</p>
            <p>Habitat: ${properties.habitat_type || 'Unknown'}</p>
            <p>Date: ${new Date(properties.observation_date).toLocaleDateString()}</p>
          </div>
        `)
        .addTo(map);
    });

    map.on('mouseleave', 'mn-points', () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    return () => {
      if (map.getLayer('mn-points')) map.removeLayer('mn-points');
      if (map.getSource('mn-points')) map.removeSource('mn-points');
    };
  }, [map, mnPoints]);

  return null;
};

export default MnDataLayer;