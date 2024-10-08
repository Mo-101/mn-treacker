import mapboxgl from 'mapbox-gl';

export const addCustomLayers = (map) => {
  map.on('load', () => {
    addTemperatureLayer(map);
    addVegetationLayer(map);
    addPrecipitationLayer(map);
    addCloudsLayer(map);
    addRadarLayer(map);
    // Wind layer is now added separately
  });
};

const addTemperatureLayer = (map) => {
  map.addSource('temperature-source', {
    type: 'raster',
    url: 'mapbox://mapbox.temperature-v2'
  });
  map.addLayer({
    id: 'temperature',
    type: 'raster',
    source: 'temperature-source',
    paint: {
      'raster-opacity': 0.7
    }
  });
};

const addVegetationLayer = (map) => {
  map.addSource('vegetation-source', {
    type: 'raster',
    url: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m'
  });
  map.addLayer({
    id: 'vegetation',
    type: 'raster',
    source: 'vegetation-source',
    paint: {
      'raster-opacity': 0.7
    }
  });
};

const addPrecipitationLayer = (map) => {
  map.addSource('precipitation-source', {
    type: 'image',
    url: 'https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif',
    coordinates: [
      [-80.425, 46.437],
      [-71.516, 46.437],
      [-71.516, 37.936],
      [-80.425, 37.936]
    ]
  });
  map.addLayer({
    id: 'precipitation',
    type: 'raster',
    source: 'precipitation-source',
    paint: {
      'raster-opacity': 0.7
    }
  });
};

const addCloudsLayer = (map) => {
  map.addSource('clouds-source', {
    type: 'raster',
    url: 'mapbox://mapbox.satellite'  // This is a placeholder. Replace with actual cloud data source
  });
  map.addLayer({
    id: 'clouds',
    type: 'raster',
    source: 'clouds-source',
    paint: {
      'raster-opacity': 0.5
    }
  });
};

const addRadarLayer = (map) => {
  map.addSource('radar-source', {
    type: 'image',
    url: 'https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif',  // Replace with actual radar data
    coordinates: [
      [-80.425, 46.437],
      [-71.516, 46.437],
      [-71.516, 37.936],
      [-80.425, 37.936]
    ]
  });
  map.addLayer({
    id: 'radar',
    type: 'raster',
    source: 'radar-source',
    paint: {
      'raster-opacity': 0.7
    }
  });
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
      'raster-particle-speed-factor': 0.4,
      'raster-particle-fade-opacity-factor': 0.9,
      'raster-particle-reset-rate-factor': 0.4,
      'raster-particle-count': 4000,
      'raster-particle-max-speed': 40,
      'raster-particle-color': [
        'interpolate',
        ['linear'],
        ['raster-particle-speed'],
        1.5, 'rgba(134,163,171,256)',
        2.5, 'rgba(126,152,188,256)',
        4.12, 'rgba(110,143,208,256)',
        4.63, 'rgba(110,143,208,256)',
        6.17, 'rgba(15,147,167,256)',
        7.72, 'rgba(15,147,167,256)',
        9.26, 'rgba(57,163,57,256)',
        10.29, 'rgba(57,163,57,256)',
        11.83, 'rgba(194,134,62,256)',
        13.37, 'rgba(194,134,63,256)',
        14.92, 'rgba(200,66,13,256)',
        16.46, 'rgba(200,66,13,256)',
        18.0, 'rgba(210,0,50,256)',
        20.06, 'rgba(215,0,50,256)',
        21.6, 'rgba(175,80,136,256)',
        23.66, 'rgba(175,80,136,256)',
        25.21, 'rgba(117,74,147,256)',
        27.78, 'rgba(117,74,147,256)',
        29.32, 'rgba(68,105,141,256)',
        31.89, 'rgba(68,105,141,256)',
        33.44, 'rgba(194,251,119,256)',
        42.18, 'rgba(194,251,119,256)',
        43.72, 'rgba(241,255,109,256)',
        48.87, 'rgba(241,255,109,256)',
        50.41, 'rgba(256,256,256,256)',
        57.61, 'rgba(256,256,256,256)',
        59.16, 'rgba(0,256,256,256)',
        68.93, 'rgba(0,256,256,256)',
        69.44, 'rgba(256,37,256,256)'
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
