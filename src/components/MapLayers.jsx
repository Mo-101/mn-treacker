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
  addWindParticleLayer(map);
  addAdminBoundariesLayer(map);
};

const addTemperatureLayer = (map) => {
  const temperatureSource = {
    type: 'raster',
    tiles: [
      `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
    ],
    tileSize: 256,
    attribution: '© OpenWeatherMap'
  };

  map.addSource('temperature', temperatureSource);
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

  // Add temperature legend
  const legend = document.createElement('div');
  legend.className = 'temperature-legend hidden';
  legend.innerHTML = `
    <div class="bg-black/70 p-2 rounded-lg text-white text-sm">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-red-500"></div>
        <span>Hot (>30°C)</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-yellow-500"></div>
        <span>Warm (20-30°C)</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-blue-500"></div>
        <span>Cool (<20°C)</span>
      </div>
    </div>
  `;
  map.getContainer().appendChild(legend);

  // Show/hide legend based on layer visibility
  map.on('layout', (e) => {
    if (e.layer.id === 'temperature') {
      legend.classList.toggle('hidden', e.layout.visibility === 'none');
    }
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

const addWindParticleLayer = (map) => {
  map.addSource('wind-particles', {
    type: 'raster-array',
    url: 'mapbox://rasterarrayexamples.gfs-winds',
    tileSize: 512
  });

  map.addLayer({
    id: 'wind',
    type: 'raster-particle',
    source: 'wind-particles',
    'source-layer': '10winds',
    layout: { visibility: 'none' },
    paint: {
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
  if (map.getLayer(layerId) && layerId !== 'admin-boundaries') {
    const currentVisibility = map.getLayoutProperty(layerId, 'visibility');
    if (currentVisibility !== (visible ? 'visible' : 'none')) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
    }
  } else if (layerId === 'admin-boundaries') {
    console.log('Admin boundaries layer is always visible');
  } else {
    console.warn(`Layer ${layerId} not found on the map.`);
  }
};
