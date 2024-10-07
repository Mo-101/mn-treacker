import mapboxgl from 'mapbox-gl';

export const initializeMap = (mapContainer, map, mapState, setMapState, addMapLayers, updateMapState, toast) => {
  try {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m', // Default style
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom
    });

    map.current.on('load', () => addMapLayers(map.current));
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

export const addMapLayers = (map) => {
  addLayer(map, 'temperature', 'raster', 'mapbox://mapbox.temperature-v1');
  addLayer(map, 'vegetation', 'raster', 'mapbox://mapbox.vegetation-v1');
  addLayer(map, 'precipitation', 'raster', 'mapbox://mapbox.precipitation-v1');
  addLayer(map, 'wind', 'vector', 'mapbox://mapbox.mapbox-terrain-v2', 'contour');
  addLayer(map, 'clouds', 'raster', 'mapbox://mapbox.clouds-v1');
  addLayer(map, 'radar', 'raster', 'mapbox://mapbox.radar-v1');
};

const addLayer = (map, name, type, url, sourceLayer = null) => {
  map.addSource(name, { type, url });
  map.addLayer({
    id: `${name}-layer`,
    type: type === 'vector' ? 'line' : 'raster',
    source: name,
    'source-layer': sourceLayer,
    layout: { visibility: 'none' },
    paint: type === 'vector' ? {
      'line-color': '#ff69b4',
      'line-width': 1
    } : undefined
  });
};

export const updateMapState = (map, setMapState) => {
  const center = map.getCenter();
  setMapState({
    lng: center.lng.toFixed(4),
    lat: center.lat.toFixed(4),
    zoom: map.getZoom().toFixed(2)
  });
};