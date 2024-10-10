import mapboxgl from 'mapbox-gl';

const addLayer = (map, id, source, type, paint) => {
  if (!map.getSource(id + '-source')) {
    map.addSource(id + '-source', source);
  }
  if (!map.getLayer(id)) {
    map.addLayer({
      id,
      type,
      source: id + '-source',
      paint,
      layout: { visibility: 'none' } // Start with all layers hidden
    });
  }
};

export const addCustomLayers = (map) => {
  addDefaultLayer(map);
  addTemperatureLayer(map);
  addVegetationLayer(map);
  addPrecipitationLayer(map);
  addCloudsLayer(map);
  addRadarLayer(map);
};

const addDefaultLayer = (map) => {
  map.setStyle('mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m');
};

const addTemperatureLayer = (map) => {
  map.addLayer({
    id: 'temperature',
    type: 'raster',
    source: {
      type: 'raster',
      url: 'mapbox://styles/akanimo1/cld5h233p000q01qat06k4qw7'
    },
    paint: { 'raster-opacity': 0.7 }
  });
};

const addVegetationLayer = (map) => {
  addLayer(map, 'vegetation', {
    type: 'raster',
    url: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m'
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
    type: 'image',
    url: 'https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif',
    coordinates: [
      [-80.425, 46.437],
      [-71.516, 46.437],
      [-71.516, 37.936],
      [-80.425, 37.936]
    ]
  }, 'raster', { 'raster-opacity': 0.7 });
};

export const toggleLayer = (map, layerId, visible) => {
  console.log(`Attempting to toggle layer ${layerId} to ${visible ? 'visible' : 'hidden'}`);
  if (map.getLayer(layerId)) {
    const currentVisibility = map.getLayoutProperty(layerId, 'visibility');
    console.log(`Current visibility of ${layerId}: ${currentVisibility}`);
    if (currentVisibility !== (visible ? 'visible' : 'none')) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      console.log(`Layer ${layerId} is now ${visible ? 'visible' : 'hidden'}`);
    } else {
      console.log(`Layer ${layerId} visibility unchanged`);
    }
  } else {
    console.warn(`Layer ${layerId} not found on the map.`);
  }
};