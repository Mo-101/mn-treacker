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
        description: "Failed to fetch MN data",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (!map || !mnPoints?.length) return;

    if (map.getLayer('mn-points')) map.removeLayer('mn-points');
    if (map.getSource('mn-points')) map.removeSource('mn-points');

    const geojson = {
      type: 'FeatureCollection',
      features: mnPoints.map(point => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.longitude, point.latitude]
        },
        properties: point
      }))
    };

    map.addSource('mn-points', {
      type: 'geojson',
      data: geojson
    });

    map.addLayer({
      id: 'mn-points',
      type: 'circle',
      source: 'mn-points',
      paint: {
        'circle-radius': 6,
        'circle-color': '#4CAF50',
        'circle-opacity': 0.8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });

    return () => {
      if (map.getLayer('mn-points')) map.removeLayer('mn-points');
      if (map.getSource('mn-points')) map.removeSource('mn-points');
    };
  }, [map, mnPoints]);

  return null;
};

export default MnDataLayer;