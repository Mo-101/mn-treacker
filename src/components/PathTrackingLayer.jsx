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

    map.addSource('movement-paths', {
      type: 'geojson',
      data: processedData,
      lineMetrics: true,
      tolerance: 0.1 // Increased precision for high resolution
    });

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
          0, '#ff3333',    // Light red for low density
          0.5, '#ff0000',  // Medium red
          1, '#cc0000'     // Dark red for high density
        ],
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 2,  // Slightly thicker at low zoom
          15, 4,  // Medium thickness
          20, 8   // Thicker at high zoom for better visibility
        ],
        'line-opacity': 0.9,  // Increased opacity
        'line-blur': 0.5      // Slight blur for smoother appearance
      }
    });

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

    return () => {
      if (map.getLayer('path-lines')) map.removeLayer('path-lines');
      if (map.getLayer('direction-symbols')) map.removeLayer('direction-symbols');
      if (map.getSource('movement-paths')) map.removeSource('movement-paths');
    };
  }, [map, processedData]);

  return null;
};

export default PathTrackingLayer;
