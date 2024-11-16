import { addPrecipitationLayer } from './precipitationLayer';
import { addCloudsLayer } from './cloudsLayer';
import { addWindLayer } from './windLayer';

export const initializeWeatherLayers = (map) => {
  addPrecipitationLayer(map);
  addCloudsLayer(map);
  addWindLayer(map);
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