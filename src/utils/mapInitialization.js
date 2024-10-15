import mapboxgl from 'mapbox-gl';
import { getWeatherLayer, getOpenWeatherTemperatureLayer } from './weatherApiUtils';

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
        paint: { 'raster-opacity': 0.8 }
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
    layout: { visibility: 'visible' }, // Set to visible by default
    paint: { 'raster-opacity': 0.8 },
  });
};

export const toggleLayer = (map, layerId, isVisible) => {
  const visibility = isVisible ? 'visible' : 'none';
  map.setLayoutProperty(layerId, 'visibility', visibility);
};

export const setLayerOpacity = (map, layerId, opacity) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
  }
};