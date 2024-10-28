import React, { useEffect, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { ArrowRight, MapPin } from 'lucide-react';
import { useToast } from './ui/use-toast';

const PathTrackingLayer = ({ map, trackingData }) => {
  const { toast } = useToast();

  const processedData = useMemo(() => {
    if (!trackingData) return null;
    return {
      type: 'FeatureCollection',
      features: trackingData.map(segment => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: segment.coordinates
        },
        properties: {
          speed: segment.speed,
          timestamp: segment.timestamp,
          density: segment.density,
          direction: segment.direction
        }
      }))
    };
  }, [trackingData]);

  useEffect(() => {
    if (!map || !processedData) return;

    // Add the path source
    map.addSource('movement-paths', {
      type: 'geojson',
      data: processedData,
      lineMetrics: true
    });

    // Add the main path layer
    map.addLayer({
      id: 'path-lines',
      type: 'line',
      source: 'movement-paths',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': [
          'interpolate',
          ['linear'],
          ['get', 'density'],
          0, '#00ff00',
          0.5, '#ffff00',
          1, '#ff0000'
        ],
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 1,
          15, 3,
          20, 6
        ],
        'line-opacity': 0.8
      }
    });

    // Add direction arrows
    map.addLayer({
      id: 'direction-symbols',
      type: 'symbol',
      source: 'movement-paths',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 50,
        'icon-image': 'arrow-right',
        'icon-size': 0.5,
        'icon-rotate': ['get', 'direction']
      }
    });

    // Add markers for key points
    trackingData.forEach((point, index) => {
      if (point.isKeyPoint) {
        const marker = new mapboxgl.Marker()
          .setLngLat(point.coordinates[0])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">Point ${index + 1}</h3>
                  <p>Time: ${new Date(point.timestamp).toLocaleString()}</p>
                  <p>Speed: ${point.speed} km/h</p>
                </div>
              `)
          )
          .addTo(map);
      }
    });

    // Add hover interactions
    map.on('mousemove', 'path-lines', (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        map.getCanvas().style.cursor = 'pointer';
        
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-2">
              <p>Speed: ${feature.properties.speed} km/h</p>
              <p>Time: ${new Date(feature.properties.timestamp).toLocaleString()}</p>
            </div>
          `)
          .addTo(map);
      }
    });

    map.on('mouseleave', 'path-lines', () => {
      map.getCanvas().style.cursor = '';
    });

    // Cleanup function
    return () => {
      if (map.getLayer('path-lines')) map.removeLayer('path-lines');
      if (map.getLayer('direction-symbols')) map.removeLayer('direction-symbols');
      if (map.getSource('movement-paths')) map.removeSource('movement-paths');
    };
  }, [map, processedData]);

  return null;
};

export default PathTrackingLayer;