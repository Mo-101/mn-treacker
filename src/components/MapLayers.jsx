import mapboxgl from 'mapbox-gl';

const addLayer = (map, id, source, type, paint, layout = {}) => {
  if (!map.getSource(id)) {
    map.addSource(id, source);
  }
  if (!map.getLayer(id)) {
    map.addLayer({
      id,
      type,
      source: id,
      paint,
      layout: { visibility: 'none', ...layout }
    });
  }
};

export const addCustomLayers = (map) => {
  addVegetationLayer(map);
  addPrecipitationLayer(map);
  addCloudsLayer(map);
  addRadarLayer(map);
  addAdminBoundariesLayer(map);
};

const addVegetationLayer = (map) => {
  addLayer(map, 'vegetation', {
    type: 'raster',
    url: 'mapbox://mapbox.satellite',
    tileSize: 256
  }, 'raster', { 
    'raster-opacity': 0.7,
    'raster-saturation': 0.5,
    'raster-hue-rotate': 90, // Adjust hue to emphasize vegetation
    'raster-brightness-min': 0.2
  });
};

const addPrecipitationLayer = (map) => {
  addLayer(map, 'precipitation', {
    type: 'raster',
    url: 'mapbox://mapbox.precipitation'
  }, 'raster', { 'raster-opacity': 0.7 });
};

const addCloudsLayer = (map) => {
  addLayer(map, 'clouds', {
    type: 'raster',
    url: 'mapbox://mapbox.satellite'
  }, 'raster', { 'raster-opacity': 0.5 });
};

const addRadarLayer = (map) => {
  addLayer(map, 'radar', {
    type: 'raster',
    url: 'mapbox://mapbox.radar'
  }, 'raster', { 'raster-opacity': 0.7 });
};

const addAdminBoundariesLayer = (map) => {
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
      'line-color': 'rgba(0, 0, 0, 0.5)',  // Black with 50% opacity
      'line-width': 1  // Reduced stroke width
    },
    layout: { visibility: 'visible' }
  });
};

export const toggleLayer = (map, layerId, visible) => {
  console.log(`Attempting to toggle layer ${layerId} to ${visible ? 'visible' : 'hidden'}`);
  if (map.getLayer(layerId) && layerId !== 'admin-boundaries') {
    const currentVisibility = map.getLayoutProperty(layerId, 'visibility');
    console.log(`Current visibility of ${layerId}: ${currentVisibility}`);
    if (currentVisibility !== (visible ? 'visible' : 'none')) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      console.log(`Layer ${layerId} is now ${visible ? 'visible' : 'hidden'}`);
    } else {
      console.log(`Layer ${layerId} visibility unchanged`);
    }
  } else if (layerId === 'admin-boundaries') {
    console.log('Admin boundaries layer is always visible');
  } else {
    console.warn(`Layer ${layerId} not found on the map.`);
  }
};
