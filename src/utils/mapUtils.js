import mapboxgl from 'mapbox-gl';
import { getWeatherLayer } from './weatherApiUtils';

export const initializeMap = (mapContainer, mapState) => {
  const map = new mapboxgl.Map({
    container: mapContainer,
    style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m',
    center: [mapState.lng, mapState.lat],
    zoom: mapState.zoom
  });

  map.on('load', () => {
    addWeatherLayers(map);
    addAdminLayer(map);
  });

  return map;
};

const addWeatherLayers = async (map) => {
  const layers = ['precipitation', 'temp', 'clouds', 'wind'];
  for (const layer of layers) {
    try {
      const source = await getWeatherLayer(layer);
      map.addSource(layer, source);
      map.addLayer({
        id: layer,
        type: 'raster',
        source: layer,
        paint: {
          'raster-opacity': 0.8,
          'raster-contrast': 0.5,  // Increase contrast for more intensity
          'raster-brightness-max': 1.2  // Increase brightness for more intensity
        }
      });
    } catch (error) {
      console.error(`Error adding layer ${layer}:`, error);
    }
  }
};

const addAdminLayer = (map) => {
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
      'line-color': '#ffffff',
      'line-width': 1.5,
      'line-opacity': 0.8
    }
  });
};

export const toggleLayer = (map, layerId, visible) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }
};

export const setLayerOpacity = (map, layerId, opacity) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
  }
};