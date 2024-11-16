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
  // Keep existing vegetation and weather layers
  addVegetationLayer(map);
  addTemperatureLayer(map);
  
  // Add new high-resolution layers
  addPrecipitationHDLayer(map);
  addWindHDLayer(map);
  addRadarHDLayer(map);
  addSatelliteHDLayer(map);
  addCloudsHDLayer(map);
  addTerrainHDLayer(map);
  addAdminBoundariesLayer(map);
};

const addVegetationLayer = (map) => {
  map.addSource('vegetation', {
    type: 'raster',
    url: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m'
  });

  map.addLayer({
    id: 'vegetation',
    type: 'raster',
    source: 'vegetation',
    paint: { 
      'raster-opacity': 0.7,
      'raster-fade-duration': 0
    },
    layout: { visibility: 'none' }
  });
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
    paint: { 
      'raster-opacity': 0.7,
      'raster-fade-duration': 0
    },
    layout: { visibility: 'none' }
  });
};

const addPrecipitationHDLayer = (map) => {
  map.addSource('precipitation-hd', {
    type: 'raster',
    tiles: [`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`],
    tileSize: 512,
    maxzoom: 18
  });

  map.addLayer({
    id: 'precipitation-hd',
    type: 'raster',
    source: 'precipitation-hd',
    paint: {
      'raster-opacity': 0.8,
      'raster-fade-duration': 0,
      'raster-resampling': 'linear'
    },
    layout: { visibility: 'none' }
  });
};

const addWindHDLayer = (map) => {
  map.addSource('wind-hd', {
    type: 'raster-array',
    url: 'mapbox://rasterarrayexamples.gfs-winds',
    tileSize: 512
  });

  map.addLayer({
    id: 'wind-hd',
    type: 'raster-particle',
    source: 'wind-hd',
    paint: {
      'raster-particle-speed-factor': 0.4,
      'raster-particle-fade-opacity-factor': 0.9,
      'raster-particle-reset-rate-factor': 0.4,
      'raster-particle-count': 8000,
      'raster-particle-max-speed': 40,
      'raster-particle-color': [
        'interpolate',
        ['linear'],
        ['raster-particle-speed'],
        1.5, 'rgba(134,163,171,0.8)',
        6.17, 'rgba(15,147,167,0.8)',
        11.83, 'rgba(194,134,62,0.8)',
        18.0, 'rgba(210,0,50,0.8)',
        25.21, 'rgba(117,74,147,0.8)',
        33.44, 'rgba(194,251,119,0.8)',
        50.41, 'rgba(255,255,255,0.8)',
        69.44, 'rgba(255,37,255,0.8)'
      ]
    },
    layout: { visibility: 'none' }
  });
};

const addRadarHDLayer = (map) => {
  map.addSource('radar-hd', {
    type: 'raster',
    tiles: [`https://tile.openweathermap.org/map/radar/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`],
    tileSize: 512,
    maxzoom: 18
  });

  map.addLayer({
    id: 'radar-hd',
    type: 'raster',
    source: 'radar-hd',
    paint: {
      'raster-opacity': 0.85,
      'raster-fade-duration': 0,
      'raster-resampling': 'linear'
    },
    layout: { visibility: 'none' }
  });
};

const addSatelliteHDLayer = (map) => {
  map.addSource('satellite-hd', {
    type: 'raster',
    url: 'mapbox://mapbox.satellite',
    tileSize: 512,
    maxzoom: 22
  });

  map.addLayer({
    id: 'satellite-hd',
    type: 'raster',
    source: 'satellite-hd',
    paint: {
      'raster-opacity': 1,
      'raster-fade-duration': 0,
      'raster-saturation': 0.2,
      'raster-contrast': 0.1,
      'raster-resampling': 'linear'
    },
    layout: { visibility: 'none' }
  });
};

const addCloudsHDLayer = (map) => {
  map.addSource('clouds-hd', {
    type: 'raster',
    tiles: [`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`],
    tileSize: 512,
    maxzoom: 18
  });

  map.addLayer({
    id: 'clouds-hd',
    type: 'raster',
    source: 'clouds-hd',
    paint: {
      'raster-opacity': 0.8,
      'raster-fade-duration': 0,
      'raster-resampling': 'linear'
    },
    layout: { visibility: 'none' }
  });
};

const addTerrainHDLayer = (map) => {
  map.addSource('terrain-hd', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512,
    maxzoom: 14
  });

  map.setTerrain({ 
    source: 'terrain-hd', 
    exaggeration: 1.5 
  });

  map.addLayer({
    id: 'terrain-hd',
    type: 'hillshade',
    source: 'terrain-hd',
    paint: {
      'hillshade-shadow-color': '#000000',
      'hillshade-highlight-color': '#ffffff',
      'hillshade-illumination-direction': 315,
      'hillshade-exaggeration': 0.8
    },
    layout: { visibility: 'none' }
  });
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
      'line-color': 'rgba(255, 255, 255, 0.5)',
      'line-width': 1
    },
    layout: { visibility: 'visible' }
  });
};

export const toggleLayer = (map, layerId, visible) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }
};
