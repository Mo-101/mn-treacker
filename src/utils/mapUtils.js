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

export const handleOpacityChange = (opacity, aerisApp, activeLayers, setLayerOpacity, addToConsoleLog) => {
  setLayerOpacity(opacity);
  if (aerisApp && aerisApp.map && aerisApp.map.layers) {
    activeLayers.forEach(layerId => {
      aerisApp.map.layers.setLayerOpacity(layerId, opacity / 100);
    });
  }
  addToConsoleLog(`Layer opacity set to ${opacity}%`);
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
    console.error('Error fetching weather data:', error.message);
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
    console.error('Error fetching Mastomys data:', error.message);
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