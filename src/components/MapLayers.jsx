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
  addTemperatureLayer(map);
  addVegetationLayer(map);
  addPrecipitationLayer(map);
  addCloudsLayer(map);
  addRadarLayer(map);
  addSatelliteLayer(map);
  addWindLayer(map);
  addAdminBoundariesLayer(map);
};

const addTemperatureLayer = (map) => {
  map.addSource('temperature', {
    type: 'raster',
    url: 'mapbox://styles/akanimo1/cld5h233p000q01qat06k4qw7'
  });
  map.addLayer({
    id: 'temperature',
    type: 'raster',
    source: 'temperature',
    paint: { 'raster-opacity': 0.7 },
    layout: { visibility: 'none' }
  });
};

const addVegetationLayer = (map) => {
  addLayer(map, 'vegetation', {
    type: 'raster',
    url: 'mapbox://mapbox.terrain-rgb'
  }, 'raster', { 'raster-opacity': 0.7 });
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

const addSatelliteLayer = (map) => {
  addLayer(map, 'satellite', {
    type: 'raster',
    url: 'mapbox://mapbox.satellite'
  }, 'raster', { 'raster-opacity': 0.7 });
};

const addWindLayer = (map) => {
  addLayer(map, 'wind', {
    type: 'raster',
    url: 'mapbox://mapbox.wind'
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
      'line-color': 'rgba(0, 0, 0, 0.5)',
      'line-width': 1
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