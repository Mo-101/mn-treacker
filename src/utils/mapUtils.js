import mapboxgl from 'mapbox-gl';

export const initializeMap = (mapContainer, mapState) => {
  if (!mapboxgl.accessToken) {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  }

  if (!mapboxgl.accessToken) {
    throw new Error('Mapbox token is required but not provided. Please check your environment variables.');
  }

  const map = new mapboxgl.Map({
    container: mapContainer,
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [mapState.lng, mapState.lat],
    zoom: mapState.zoom,
    pitch: 45,
    bearing: 0,
    antialias: true
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  return map;
};

export const updateMapState = (map, setMapState) => {
  if (!map) return;
  
  const center = map.getCenter();
  setMapState({
    lng: center.lng.toFixed(4),
    lat: center.lat.toFixed(4),
    zoom: map.getZoom().toFixed(2)
  });
};

export const toggleLayer = (map, layerId, visible) => {
  if (!map || !map.getLayer(layerId)) return;
  map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
};

export const setLayerOpacity = (map, layerId, opacity) => {
  if (!map || !map.getLayer(layerId)) return;
  map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
};