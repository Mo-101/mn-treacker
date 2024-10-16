import mapboxgl from 'mapbox-gl';

export const initializeMap = (mapContainer, mapState) => {
  const map = new mapboxgl.Map({
    container: mapContainer,
    style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m', // New default style
    center: [mapState.lng, mapState.lat],
    zoom: mapState.zoom
  });

  return map;
};

export const addWeatherLayers = async (map) => {
  const layers = ['precipitation', 'clouds', 'wind'];
  for (const layer of layers) {
    try {
      const source = await getWeatherLayer(layer);
      map.addSource(layer, source);
      map.addLayer({
        id: layer,
        type: 'raster',
        source: layer,
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.7 }
      });
      console.log(`Added layer: ${layer}`);
    } catch (error) {
      console.error(`Error adding layer ${layer}:`, error);
    }
  }
};

export const addOpenWeatherLayer = (map) => {
  const temperatureSource = getOpenWeatherTemperatureLayer();
  map.addSource('openWeatherTemperature', temperatureSource);

  map.addLayer({
    id: 'openWeatherTemperatureLayer',
    type: 'raster',
    source: 'openWeatherTemperature',
    layout: { visibility: 'visible' },
    paint: { 'raster-opacity': 0.7 },
  });
};

export const addAdminBoundariesLayer = (map) => {
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

export const toggleLayer = (map, layerId, isVisible) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
  }
};

export const setLayerOpacity = (map, layerId, opacity) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
  }
};

export const fetchWeatherData = async (map, mapState, addToConsoleLog) => {
  try {
    addToConsoleLog('Fetching weather data...');
    // Implement weather data fetching logic here
    // For example:
    // const response = await fetch(`/api/weather?lat=${mapState.lat}&lng=${mapState.lng}`);
    // const data = await response.json();
    // Process and use the weather data
  } catch (error) {
    console.error('Error fetching weather data:', error);
    addToConsoleLog('Failed to fetch weather data');
  }
};

export const fetchMastomysData = async (setMastomysData, addToConsoleLog) => {
  try {
    addToConsoleLog('Fetching Mastomys data...');
    // Implement Mastomys data fetching logic here
    // For example:
    // const response = await fetch('/api/mastomys-data');
    // const data = await response.json();
    // setMastomysData(data);
  } catch (error) {
    console.error('Error fetching Mastomys data:', error);
    addToConsoleLog('Failed to fetch Mastomys data');
  }
};

export const updatePredictionLayer = (map, predictionData) => {
  if (map.getSource('prediction-hotspots')) {
    map.getSource('prediction-hotspots').setData({
      type: 'FeatureCollection',
      features: predictionData.map(point => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.lng, point.lat]
        },
        properties: {
          risk: point.risk
        }
      }))
    });
  }
};

