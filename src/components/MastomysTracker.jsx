import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { fetchRatLocations } from '../utils/api';

const MastomysTracker = ({ map }) => {
  const [ratLocations, setRatLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRatLocations();
        setRatLocations(data.features);
      } catch (error) {
        console.error('Error fetching rat locations:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!map || ratLocations.length === 0) return;

    // Add rat locations to the map
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
        'circle-color': '#B42222'
      }
    });

    return () => {
      if (map.getLayer('rat-points')) map.removeLayer('rat-points');
      if (map.getSource('rat-locations')) map.removeSource('rat-locations');
    };
  }, [map, ratLocations]);

  return null; // This component doesn't render anything directly
};

export default MastomysTracker;