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
      layout: { visibility: 'visible', ...layout }  // Changed default visibility to 'visible'
    });
  }
};

export const addCustomLayers = (map) => {
  addVegetationLayer(map);
  addPrecipitationLayer(map);
  addCloudsLayer(map);
  addRadarLayer(map);
  addAdminBoundariesLayer(map);  // Ensure this is called
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
  if (!map.getSource('admin-boundaries')) {
    map.addSource('admin-boundaries', {
      type: 'vector',
      url: 'mapbox://mapbox.boundaries-adm0-v3,mapbox.boundaries-adm1-v3,mapbox.boundaries-adm2-v3'
    });
  }

  // Add country boundaries
  if (!map.getLayer('admin-boundaries-country')) {
    map.addLayer({
      id: 'admin-boundaries-country',
      type: 'line',
      source: 'admin-boundaries',
      'source-layer': 'boundaries_admin_0',
      paint: {
        'line-color': '#FFD700',  // Gold color for country boundaries
        'line-width': 2,
        'line-opacity': 0.8
      },
      layout: { visibility: 'visible' }
    });
  }

  // Add state/province boundaries
  if (!map.getLayer('admin-boundaries-state')) {
    map.addLayer({
      id: 'admin-boundaries-state',
      type: 'line',
      source: 'admin-boundaries',
      'source-layer': 'boundaries_admin_1',
      paint: {
        'line-color': '#FFA500',  // Orange color for state boundaries
        'line-width': 1,
        'line-opacity': 0.6
      },
      layout: { visibility: 'visible' }
    });
  }

  // Add district/county boundaries
  if (!map.getLayer('admin-boundaries-district')) {
    map.addLayer({
      id: 'admin-boundaries-district',
      type: 'line',
      source: 'admin-boundaries',
      'source-layer': 'boundaries_admin_2',
      paint: {
        'line-color': '#FFE4B5',  // Moccasin color for district boundaries
        'line-width': 0.5,
        'line-opacity': 0.4
      },
      layout: { visibility: 'visible' }
    });
  }
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
