import mapboxgl from 'mapbox-gl';

export const initializeMap = (mapContainer, map, mapState, setMapState, addCustomLayers, updateMapState, toast) => {
  try {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m', // Default style
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      maxBounds: [[-25, -40], [65, 40]] // Restrict map panning to around Africa
    });

    map.current.on('load', () => addCustomLayers(map.current));
    map.current.on('move', () => updateMapState(map.current, setMapState));
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
    }
  });
  // Add more layers as needed
};