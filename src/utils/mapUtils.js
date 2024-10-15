import mapboxgl from 'mapbox-gl';
import { getWeatherLayer, getPrecipitationLayer } from './weatherApiUtils';

export const initializeMap = (mapContainer, mapState) => {
  const map = new mapboxgl.Map({
    container: mapContainer,
    style: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m',
    center: [mapState.lng, mapState.lat],
    zoom: mapState.zoom,
    maxZoom: 19
  });

  return map;
};

export const addWeatherLayers = async (map) => {
  const layers = ['temp_new', 'clouds_new', 'wind_new'];
  for (const layer of layers) {
    try {
      const source = getWeatherLayer(layer);
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

  // Add animated precipitation layer
  const precipitationSource = getPrecipitationLayer();
  map.addSource('precipitation', precipitationSource);
  map.addLayer({
    id: 'precipitation',
    type: 'raster',
    source: 'precipitation',
    layout: { visibility: 'none' },
    paint: { 'raster-opacity': 0.8 }
  });

  // Animate precipitation layer
  let frame = 0;
  const animatePrecipitation = () => {
    frame = (frame + 1) % 4;
    map.setPaintProperty('precipitation', 'raster-opacity', 0.8 - frame * 0.1);
    requestAnimationFrame(animatePrecipitation);
  };
  animatePrecipitation();
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