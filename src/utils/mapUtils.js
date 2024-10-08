import mapboxgl from 'mapbox-gl';

export const initializeMap = (mapContainer, map, mapState, setMapState, addCustomLayers, updateMapState, toast) => {
  try {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m', // Default style
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      maxBounds: [[-30, -40], [60, 40]] // Adjusted to allow viewing the entire African continent
    });

    map.current.on('load', () => addCustomLayers(map.current));
    map.current.on('move', () => updateMapState(map.current, setMapState));
  } catch (error) {
    console.error('Error initializing map:', error);
    // Use a safe error reporting mechanism
    reportSafeError(error, toast);
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

// Updated function to safely report errors
const reportSafeError = (error, toast) => {
  const safeErrorObject = {
    message: error.message,
    name: error.name,
    // Avoid including the stack trace as it might contain non-clonable information
  };

  // Use the toast function to display the error
  toast({
    title: "Error",
    description: `Failed to initialize map: ${safeErrorObject.message}`,
    variant: "destructive",
  });

  // If you want to send the error to a server, use a safe method that doesn't involve postMessage
  // For example, you could use the Fetch API directly:
  fetch('/api/report-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(safeErrorObject)
  }).catch(console.error);
};
