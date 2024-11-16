import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from "./ui/use-toast";
import { fetchRatLocations } from '../utils/dataFetching';

const MastomysTracker = ({ map }) => {
  const [ratLocations, setRatLocations] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadRatLocations = async () => {
      try {
        const data = await fetchRatLocations();
        setRatLocations(data.map(location => ({
          geometry: {
            coordinates: [location.longitude, location.latitude],
            type: "Point"
          },
          properties: {
            timestamp: new Date().toISOString(),
            confidence: 0.95
          }
        })));
      } catch (error) {
        console.error('Error fetching rat locations:', error);
        toast({
          title: "Warning",
          description: "Couldn't fetch rat locations from database",
          variant: "warning",
        });
      }
    };

    loadRatLocations();
  }, [toast]);

  useEffect(() => {
    if (!map || !ratLocations.length) return;

    if (!map.getSource('rat-locations')) {
      map.addSource('rat-locations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: ratLocations
        }
      });

      map.addLayer({
        id: 'rat-points-glow',
        type: 'circle',
        source: 'rat-locations',
        paint: {
          'circle-radius': 15,
          'circle-color': '#B42222',
          'circle-opacity': 0.15,
          'circle-blur': 1
        }
      });

      map.addLayer({
        id: 'rat-points',
        type: 'circle',
        source: 'rat-locations',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222',
          'circle-opacity': 0.7
        }
      });
    } else {
      map.getSource('rat-locations').setData({
        type: 'FeatureCollection',
        features: ratLocations
      });
    }

    return () => {
      if (map.getLayer('rat-points')) map.removeLayer('rat-points');
      if (map.getLayer('rat-points-glow')) map.removeLayer('rat-points-glow');
      if (map.getSource('rat-locations')) map.removeSource('rat-locations');
    };
  }, [map, ratLocations]);

  return null;
};

export default MastomysTracker;