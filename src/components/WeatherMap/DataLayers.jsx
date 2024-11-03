import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMastomysLocations, fetchLassaFeverCases } from '../../utils/api';
import mapboxgl from 'mapbox-gl';

const DataLayers = ({ map, activeLayers }) => {
  const { data: ratLocations } = useQuery({
    queryKey: ['ratLocations'],
    queryFn: fetchMastomysLocations,
    staleTime: 300000
  });

  const { data: lassaCases } = useQuery({
    queryKey: ['lassaCases'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000
  });

  React.useEffect(() => {
    if (!map || !ratLocations || !lassaCases) return;

    // Add rat locations source and layer
    if (!map.getSource('rat-points')) {
      map.addSource('rat-points', {
        type: 'geojson',
        data: ratLocations
      });

      map.addLayer({
        id: 'points',
        type: 'circle',
        source: 'rat-points',
        paint: {
          'circle-radius': 6,
          'circle-color': '#FFD700',
          'circle-opacity': 0.8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
    }

    // Add Lassa fever cases source and layer
    if (!map.getSource('lassa-cases')) {
      map.addSource('lassa-cases', {
        type: 'geojson',
        data: lassaCases
      });

      map.addLayer({
        id: 'cases',
        type: 'circle',
        source: 'lassa-cases',
        paint: {
          'circle-radius': 8,
          'circle-color': '#FF4136',
          'circle-opacity': 0.8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
    }

    // Add popups
    const addPopup = (e, layerId) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      const title = layerId === 'points' ? 'Rat Location' : 'Lassa Fever Case';

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${title}</h3>
            <p>Coordinates: ${coordinates}</p>
            ${Object.entries(properties).map(([key, value]) => 
              `<p>${key}: ${value}</p>`
            ).join('')}
          </div>
        `)
        .addTo(map);
    };

    map.on('click', 'points', (e) => addPopup(e, 'points'));
    map.on('click', 'cases', (e) => addPopup(e, 'cases'));

    return () => {
      map.off('click', 'points');
      map.off('click', 'cases');
    };
  }, [map, ratLocations, lassaCases]);

  React.useEffect(() => {
    if (!map) return;

    activeLayers.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      }
    });
  }, [map, activeLayers]);

  return null;
};

export default DataLayers;