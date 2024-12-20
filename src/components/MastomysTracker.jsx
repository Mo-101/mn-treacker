import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from "./ui/use-toast";

const MastomysTracker = ({ map }) => {
  const [ratLocations, setRatLocations] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRatLocations = async () => {
      try {
        // Use mock data if in development or if API is not available
        if (import.meta.env.DEV || !import.meta.env.VITE_API_URL) {
          const mockData = {
            features: [
              {
                geometry: {
                  coordinates: [3.3792, 6.5244], // Lagos coordinates
                  type: "Point"
                },
                properties: {
                  timestamp: new Date().toISOString(),
                  confidence: 0.95
                }
              }
            ]
          };
          setRatLocations(mockData.features);
          return;
        }

        const response = await fetch('/api/rat-locations');
        if (!response.ok) {
          throw new Error('Failed to fetch rat locations');
        }
        const data = await response.json();
        setRatLocations(data.features);
      } catch (error) {
        console.error('Error fetching rat locations:', error);
        toast({
          title: "Warning",
          description: "Using sample data - couldn't fetch real rat locations",
          variant: "warning",
        });
      }
    };

    fetchRatLocations();
  }, [toast]);

  useEffect(() => {
    if (!map || !ratLocations.length) return;

    // Add rat locations to the map
    if (!map.getSource('rat-locations')) {
      map.addSource('rat-locations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: ratLocations
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
      // Update existing source
      map.getSource('rat-locations').setData({
        type: 'FeatureCollection',
        features: ratLocations
      });
    }

    return () => {
      if (map.getLayer('rat-points')) map.removeLayer('rat-points');
      if (map.getSource('rat-locations')) map.removeSource('rat-locations');
    };
  }, [map, ratLocations]);

  return null;
};

export default MastomysTracker;