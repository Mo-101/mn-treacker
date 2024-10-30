import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const DetectionSpotLayer = ({ map, detections }) => {
  useEffect(() => {
    if (!map || !map.loaded() || !detections) return;

    const layerIds = ['detection-glow-outer', 'detection-glow-inner', 'detection-center'];
    
    const cleanup = () => {
      layerIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      });
      if (map.getSource('detection-points')) {
        map.removeSource('detection-points');
      }
    };

    try {
      cleanup();

      map.addSource('detection-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: detections.map(detection => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: detection.coordinates || [detection.longitude, detection.latitude]
            },
            properties: {
              species: detection.species || 'Mastomys natalensis',
              confidence: detection.confidence || 95,
              timestamp: detection.timestamp || new Date().toISOString(),
              details: detection.details || 'Adult specimen detected',
              habitat: detection.habitat || 'Urban environment',
              behavior: detection.behavior || 'Foraging activity'
            }
          }))
        }
      });

      map.addLayer({
        id: 'detection-glow-outer',
        type: 'circle',
        source: 'detection-points',
        paint: {
          'circle-radius': 30,
          'circle-color': '#ff0000',
          'circle-opacity': 0.15,
          'circle-blur': 1
        }
      });

      map.addLayer({
        id: 'detection-glow-inner',
        type: 'circle',
        source: 'detection-points',
        paint: {
          'circle-radius': 20,
          'circle-color': '#ff0000',
          'circle-opacity': 0.3,
          'circle-blur': 0.5
        }
      });

      map.addLayer({
        id: 'detection-center',
        type: 'circle',
        source: 'detection-points',
        paint: {
          'circle-radius': 8,
          'circle-color': '#ff0000',
          'circle-opacity': 0.8
        }
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'detection-popup',
        maxWidth: '300px'
      });

      map.on('mouseenter', 'detection-center', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;
        
        const popupContent = `
          <div class="bg-gray-900/95 p-4 rounded-lg shadow-xl">
            <h3 class="text-amber-400 font-bold mb-2">${properties.species}</h3>
            <div class="space-y-1 text-white">
              <p><span class="text-amber-400">Confidence:</span> ${properties.confidence}%</p>
              <p><span class="text-amber-400">Time:</span> ${new Date(properties.timestamp).toLocaleString()}</p>
              <p><span class="text-amber-400">Details:</span> ${properties.details}</p>
              <p><span class="text-amber-400">Habitat:</span> ${properties.habitat}</p>
              <p><span class="text-amber-400">Behavior:</span> ${properties.behavior}</p>
            </div>
          </div>
        `;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
      });

      map.on('mouseleave', 'detection-center', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    } catch (error) {
      console.error('Error setting up detection layers:', error);
    }

    return cleanup;
  }, [map, detections]);

  return null;
};

export default DetectionSpotLayer;