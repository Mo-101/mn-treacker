import { initializeWeatherLayers, toggleLayer, setLayerOpacity } from '../utils/mapLayers';

export const addCustomLayers = (map) => {
  // Initialize weather layers
  initializeWeatherLayers(map);
  
  // Add admin boundaries for context
  map.addSource('admin-boundaries', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-streets-v8'
  });

  map.addLayer({
    id: 'admin-boundaries',
    type: 'line',
    source: 'admin-boundaries',
    'source-layer': 'admin',
    paint: {
      'line-color': 'rgba(255, 255, 255, 0.5)',
      'line-width': 1
    },
    layout: { visibility: 'visible' }
  });
};

export { toggleLayer, setLayerOpacity };