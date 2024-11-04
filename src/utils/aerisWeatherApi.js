import AerisWeather from '@aerisweather/javascript-sdk';
import { reportError } from './errorReporting';

const aeris = new AerisWeather(import.meta.env.VITE_XWEATHER_ID, import.meta.env.VITE_XWEATHER_SECRET);

const validLayers = ['radar', 'satellite', 'temperatures', 'wind', 'precipitation'];

export const initializeAerisMap = async (container, mapState) => {
  try {
    const map = await aeris.views().then(views => {
      return new views.InteractiveMap(container, {
        center: {
          lat: mapState.lat,
          lon: mapState.lng
        },
        zoom: mapState.zoom,
        layers: validLayers.join(','),
        timeline: {
          from: -2 * 3600,
          to: 0
        }
      });
    });
    return { success: true, map };
  } catch (error) {
    reportError(error);
    return { success: false, error: error.message };
  }
};

export const toggleAerisLayer = async (layerName, isEnabled) => {
  try {
    if (!validLayers.includes(layerName)) {
      throw new Error(`Invalid layer: ${layerName}`);
    }
    const map = await aeris.maps().getMap('aeris-map');
    if (map) {
      map.layers.setLayerVisibility(layerName, isEnabled);
      return { success: true };
    }
    return { success: false, error: 'Map not found' };
  } catch (error) {
    reportError(error);
    return { success: false, error: error.message };
  }
};

export const setAerisLayerOpacity = async (layerName, opacity) => {
  try {
    if (!validLayers.includes(layerName)) {
      throw new Error(`Invalid layer: ${layerName}`);
    }
    const map = await aeris.maps().getMap('aeris-map');
    if (map) {
      map.layers.setLayerOpacity(layerName, opacity);
      return { success: true };
    }
    return { success: false, error: 'Map not found' };
  } catch (error) {
    reportError(error);
    return { success: false, error: error.message };
  }
};