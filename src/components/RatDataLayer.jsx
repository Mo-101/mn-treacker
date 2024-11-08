import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const RatDataLayer = ({ map, ratData }) => {
  useEffect(() => {
    if (!map || !ratData || !ratData.features) return;

    // Remove existing layers and sources if they exist
    if (map.getLayer('rat-points')) map.removeLayer('rat-points');
    if (map.getSource('rat-data')) map.removeSource('rat-data');

    // Add the GeoJSON source
    map.addSource('rat-data', {
      type: 'geojson',
      data: ratData
    });

    // Add the layer
    map.addLayer({
      id: 'rat-points',
      type: 'circle',
      source: 'rat-data',
      paint: {
        'circle-radius': 6,
        'circle-color': '#B42222',
        'circle-opacity': 0.7
      }
    });

    console.log('Rat data added to map:', ratData.features.length, 'points');

    return () => {
      if (map.getLayer('rat-points')) map.removeLayer('rat-points');
      if (map.getSource('rat-data')) map.removeSource('rat-data');
    };
  }, [map, ratData]);

  return null;
};

export default RatDataLayer;