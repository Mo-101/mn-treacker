import mapboxgl from 'mapbox-gl';

const addLayer = (map, id, source, type, paint) => {
  map.addSource(id + '-source', source);
  map.addLayer({
    id,
    type,
    source: id + '-source',
    paint
  });
};

export const addCustomLayers = (map) => {
  map.on('load', () => {
    addTemperatureLayer(map);
    addVegetationLayer(map);
    addPrecipitationLayer(map);
    addCloudsLayer(map);
    addRadarLayer(map);
  });
};

const addTemperatureLayer = (map) => {
  addLayer(map, 'temperature', {
    type: 'raster',
    url: 'mapbox://mapbox.temperature-v2'
  }, 'raster', { 'raster-opacity': 0.7 });
};

const addVegetationLayer = (map) => {
  addLayer(map, 'vegetation', {
    type: 'raster',
    url: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m'
  }, 'raster', { 'raster-opacity': 0.7 });
};

const addPrecipitationLayer = (map) => {
  addLayer(map, 'precipitation', {
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

export const addWindLayer = (map) => {
  map.addSource('raster-array-source', {
    'type': 'raster-array',
    'url': 'mapbox://rasterarrayexamples.gfs-winds',
    'tileSize': 512
  });
  map.addLayer({
    'id': 'wind-layer',
    'type': 'raster-particle',
    'source': 'raster-array-source',
    'source-layer': '10winds',
    'paint': {
      'raster-particle-speed-factor': 0.3,
      'raster-particle-fade-opacity-factor': 0.95,
      'raster-particle-reset-rate-factor': 0.3,
      'raster-particle-count': 2000,
      'raster-particle-max-speed': 30,
      'raster-particle-stroke-width': 0.15, // Reduced from 0.3 to 0.15 (half the original size)
      'raster-particle-color': [
        'interpolate',
        ['linear'],
        ['raster-particle-speed'],
        1.5, 'rgba(134,163,171,128)',
        10.29, 'rgba(57,163,57,128)',
        20.06, 'rgba(215,0,50,128)',
        31.89, 'rgba(68,105,141,128)',
        43.72, 'rgba(241,255,109,128)',
        57.61, 'rgba(256,256,256,128)',
        69.44, 'rgba(256,37,256,128)'
      ]
    }
  });
};

export const addXweatherRadarAnimation = (map) => {
  const clientId = import.meta.env.VITE_XWEATHER_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_XWEATHER_CLIENT_SECRET;
  const wxLayer = 'radar';
  const frameCount = 10;
  const intervalStep = 10;
  let currentImageOffset = 0;
  let lastImageOffset = currentImageOffset;

  const getPath = (server, offset) => {
    return `https://maps${server}.aerisapi.com/${clientId}_${clientSecret}/${wxLayer}/{z}/{x}/{y}/${(offset * intervalStep) * -1}min.png`;
  };

  const getTilePaths = (offset) => {
    return [
      getPath(1, offset),
      getPath(2, offset),
      getPath(3, offset),
      getPath(4, offset),
    ];
  };

  const addRasterLayer = (i) => {
    map.addSource(wxLayer + i, {
      "type": 'raster',
      "tiles": getTilePaths(i),
      "tileSize": 256,
      "attribution": "<a href='https://www.xweather.com/'>Xweather</a>"
    });

    map.addLayer({
      "id": wxLayer + i,
      "type": "raster",
      "source": wxLayer + i,
      "minzoom": 0,
      "maxzoom": 22,
      "paint": {
        'raster-opacity': 0
      }
    });
  };

  const setRasterLayerVisibility = (id, opacity, transition = { duration: 0, delay: 0 }) => {
    map.setPaintProperty(id, 'raster-opacity-transition', transition);
    map.setPaintProperty(id, 'raster-opacity', opacity);
  };

  const showRasterLayer = (id) => {
    setRasterLayerVisibility(id, 1);
  };

  const hideRasterLayer = (id) => {
    setRasterLayerVisibility(id, 0);
  };

  addRasterLayer(0);
  showRasterLayer(wxLayer + currentImageOffset);

  for (let i = frameCount - 1; i > 0; i--) {
    addRasterLayer(i);
  }

  setInterval(() => {
    lastImageOffset = currentImageOffset;
    currentImageOffset--;
    
    if (currentImageOffset < 0) currentImageOffset = frameCount - 1;
    
    hideRasterLayer(wxLayer + lastImageOffset);
    showRasterLayer(wxLayer + currentImageOffset);
  }, 1000);
};