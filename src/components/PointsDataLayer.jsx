import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useQuery } from '@tanstack/react-query';
import { fetchPointsData } from '../utils/api';
import { useToast } from './ui/use-toast';

const PointsDataLayer = ({ map }) => {
  const { toast } = useToast();
  const { data: points } = useQuery({
    queryKey: ['points-data'],
    queryFn: fetchPointsData,
    staleTime: 300000,
    retry: 1,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch points data",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (!map || !points?.length) return;

    if (map.getLayer('data-points')) map.removeLayer('data-points');
    if (map.getSource('data-points')) map.removeSource('data-points');

    const geojson = {
      type: 'FeatureCollection',
      features: points.map(point => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.longitude, point.latitude]
        },
        properties: point
      }))
    };

    map.addSource('data-points', {
      type: 'geojson',
      data: geojson
    });

    map.addLayer({
      id: 'data-points',
      type: 'circle',
      source: 'data-points',
      paint: {
        'circle-radius': 6,
        'circle-color': '#2196F3',
        'circle-opacity': 0.8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });

    return () => {
      if (map.getLayer('data-points')) map.removeLayer('data-points');
      if (map.getSource('data-points')) map.removeSource('data-points');
    };
  }, [map, points]);

  return null;
};

export default PointsDataLayer;