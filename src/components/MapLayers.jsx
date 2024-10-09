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
      paint
    });
  }
};

export const addCustomLayers = (map) => {
  map.on('load', () => {
    addTemperatureLayer(map);
    addVegetationLayer(map);
    addPrecipitationLayer(map);
    addCloudsLayer(map);
    addWindLayer(map);
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

export const addWindLayer = (map) => {
  if (!map.getSource('raster-array-source')) {
    map.addSource('raster-array-source', {
      'type': 'raster-array',
      'url': 'mapbox://rasterarrayexamples.gfs-winds',
      'tileSize': 512
    });
  }

  const updateWindLayer = () => {
    const zoom = map.getZoom();
    const particleCount = Math.min(10000, Math.max(5000, Math.floor(zoom * 1000)));
    const particleSize = Math.max(0.1, 0.5 - zoom * 0.05);

    if (!map.getLayer('wind-layer')) {
      map.addLayer({
        'id': 'wind-layer',
        'type': 'raster-particle',
        'source': 'raster-array-source',
        'source-layer': '10winds',
        'paint': {
          'raster-particle-speed-factor': 0.3,
          'raster-particle-fade-opacity-factor': 0.95,
          'raster-particle-reset-rate-factor': 0.3,
          'raster-particle-count': particleCount,
          'raster-particle-max-speed': 30,
          'raster-particle-stroke-width': particleSize,
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
    } else {
      map.setPaintProperty('wind-layer', 'raster-particle-count', particleCount);
      map.setPaintProperty('wind-layer', 'raster-particle-stroke-width', particleSize);
    }
  };

  updateWindLayer();
  map.on('zoom', updateWindLayer);

  // Add animated weather layer
  addAnimatedWeatherLayer(map);
};

const addAnimatedWeatherLayer = (map) => {
  if (!map.getSource('animated-weather-source')) {
    map.addSource('animated-weather-source', {
      type: 'image',
      url: 'https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif',
      coordinates: [
        [-80.425, 46.437],
        [-71.516, 46.437],
        [-71.516, 37.936],
        [-80.425, 37.936]
      ]
    });
  }

  if (!map.getLayer('animated-weather-layer')) {
    map.addLayer({
      id: 'animated-weather-layer',
      type: 'raster',
      source: 'animated-weather-source',
      paint: {
        'raster-opacity': 0.7
      }
    });
  }
};

export const toggleWindLayer = (map, visible) => {
  if (map.getLayer('wind-layer')) {
    map.setLayoutProperty('wind-layer', 'visibility', visible ? 'visible' : 'none');
  }
  if (map.getLayer('animated-weather-layer')) {
    map.setLayoutProperty('animated-weather-layer', 'visibility', visible ? 'visible' : 'none');
  }
};