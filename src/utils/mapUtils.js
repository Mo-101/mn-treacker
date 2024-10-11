import mapboxgl from 'mapbox-gl';

export const initializeMap = (mapContainer, map, mapState, setMapState, addCustomLayers, updateMapState, toast) => {
  try {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      pitch: 45,
      bearing: 0,
      antialias: true
    });

    map.current.on('load', () => {
      map.current.addControl(new mapboxgl.NavigationControl());
      addCustomLayers(map.current);
      updateMapState();
    });

    map.current.on('move', updateMapState);

    map.current.on('style.load', () => {
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    });
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
