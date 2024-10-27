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
  addAdminBoundariesLayer(map);
};

const addTemperatureLayer = (map) => {
  // Using OpenWeatherMap temperature layer
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
