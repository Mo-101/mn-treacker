import mapboxgl from 'mapbox-gl';

export const addCustomLayers = (map) => {
  map.on('load', () => {
    addTemperatureLayer(map);
    addVegetationLayer(map);
    addPrecipitationLayer(map);
    addWindLayer(map);
    addCloudsLayer(map);
    addRadarLayer(map);
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

const addWindLayer = (map) => {
  map.addSource('raster-array-source', {
    type: 'raster-array',
    url: 'mapbox://rasterarrayexamples.gfs-winds',
    tileSize: 512
  });
  map.addLayer({
    id: 'wind-layer',
    type: 'raster-particle',
    source: 'raster-array-source',
    'source-layer': '10winds',
    paint: {
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
        30.34, 'rgba(117,74,147,256)',
        32.4, 'rgba(117,74,147,256)',
        34.46, 'rgba(117,74,147,256)',
        36.51, 'rgba(117,74,147,256)',
        38.57, 'rgba(117,74,147,256)',
        40.63, 'rgba(117,74,147,256)',
        42.68, 'rgba(117,74,147,256)',
        44.74, 'rgba(117,74,147,256)',
        46.8, 'rgba(117,74,147,256)',
        48.85, 'rgba(117,74,147,256)',
        50.91, 'rgba(117,74,147,256)',
        52.97, 'rgba(117,74,147,256)',
        55.02, 'rgba(117,74,147,256)',
        57.08, 'rgba(117,74,147,256)',
        59.14, 'rgba(117,74,147,256)',
        61.19, 'rgba(117,74,147,256)',
        63.25, 'rgba(117,74,147,256)',
        65.31, 'rgba(117,74,147,256)',
        67.36, 'rgba(117,74,147,256)',
        69.42, 'rgba(117,74,147,256)',
        71.48, 'rgba(117,74,147,256)',
        73.53, 'rgba(117,74,147,256)',
        75.59, 'rgba(117,74,147,256)',
        77.65, 'rgba(117,74,147,256)',
        79.7, 'rgba(117,74,147,256)',
        81.76, 'rgba(117,74,147,256)',
        83.82, 'rgba(117,74,147,256)',
        85.87, 'rgba(117,74,147,256)',
        87.93, 'rgba(117,74,147,256)',
        89.99, 'rgba(117,74,147,256)',
        92.04, 'rgba(117,74,147,256)',
        94.1, 'rgba(117,74,147,256)',
        96.16, 'rgba(117,74,147,256)',
        98.21, 'rgba(117,74,147,256)',
        100.27, 'rgba(117,74,147,256)',
        102.33, 'rgba(117,74,147,256)',
        104.38, 'rgba(117,74,147,256)',
        106.44, 'rgba(117,74,147,256)'
      ]
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
