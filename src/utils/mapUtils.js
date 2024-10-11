import mapboxgl from 'mapbox-gl';

export const initializeMap = (mapContainer, map, mapState, setMapState, addCustomLayers, updateMapState, toast) => {
  try {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m', // Your custom Mapbox style
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      maxBounds: [[-30, -40], [60, 40]] // Adjusted to allow viewing the entire African continent
    });

    map.current.on('load', () => {
      addCustomLayers(map.current);
      updateMapState();
    });
    map.current.on('move', updateMapState);
  } catch (error) {
    console.error('Error initializing map:', error);
    toast({
      title: "Error",
      description: "Failed to initialize map. Please try again later.",
      variant: "destructive",
    });
  }
};

export const updateMapState = (map, setMapState) => {
  const center = map.getCenter();
  setMapState({
    lng: center.lng.toFixed(4),
    lat: center.lat.toFixed(4),
    zoom: map.getZoom().toFixed(2)
  });
};

export const addMapLayers = (map) => {
  // Add your map layers here
  // For example:
  map.addSource('temperature', {
    type: 'raster',
    url: 'mapbox://mapbox.temperature-v2'
  });
  map.addLayer({
    id: 'temperature',
    type: 'raster',
    source: 'temperature',
    paint: {
      'raster-opacity': 0.5
    },
    layout: {
      visibility: 'none' // Set to 'none' by default
    }
  });
  // Add more layers as needed, all with visibility set to 'none' by default
};

export const toggleLayer = (map, layerId, visible) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }
};

export const handleLayerToggle = (layerId, map, setActiveLayers, addToConsoleLog) => {
  if (map) {
    const visibility = map.getLayoutProperty(layerId, 'visibility');
    toggleLayer(map, layerId, visibility !== 'visible');
    setActiveLayers(prev => 
      visibility === 'visible' 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
    addToConsoleLog(`Layer ${layerId} ${visibility !== 'visible' ? 'enabled' : 'disabled'}`);
  }
};

export const handleOpacityChange = (opacity, map, activeLayers, setLayerOpacity, addToConsoleLog) => {
  setLayerOpacity(opacity);
  activeLayers.forEach(layerId => {
    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
    }
  });
  addToConsoleLog(`Layer opacity set to ${opacity}%`);
};

export const fetchWeatherData = (map, mapState, addToConsoleLog) => {
  // Implement weather data fetching logic here
  addToConsoleLog('Fetching weather data...');
};

export const fetchMastomysData = (setMastomysData, addToConsoleLog) => {
  // Implement Mastomys data fetching logic here
  addToConsoleLog('Fetching Mastomys data...');
};