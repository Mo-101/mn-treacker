import AerisWeather from '@aerisweather/javascript-sdk';

const aeris = new AerisWeather(import.meta.env.VITE_XWEATHER_ID, import.meta.env.VITE_XWEATHER_SECRET);

export const toggleAerisLayer = async (layerName, isEnabled) => {
  try {
    const map = await aeris.maps().getMap('aeris-map');
    if (map) {
      map.layers.setLayerVisibility(layerName, isEnabled);
      return { success: true };
    }
    return { success: false, error: 'Map not found' };
  } catch (error) {
    console.error('Error toggling layer:', error);
    return { success: false, error: error.message };
  }
};

export const setAerisLayerOpacity = async (layerName, opacity) => {
  try {
    const map = await aeris.maps().getMap('aeris-map');
    if (map) {
      map.layers.setLayerOpacity(layerName, opacity);
      return { success: true };
    }
    return { success: false, error: 'Map not found' };
  } catch (error) {
    console.error('Error setting layer opacity:', error);
    return { success: false, error: error.message };
  }
};

export const initializeAerisMap = async (container, mapState) => {
  try {
    const map = await aeris.views().then(views => {
      return new views.InteractiveMap(container, {
        center: {
          lat: mapState.lat,
          lon: mapState.lng
        },
        zoom: mapState.zoom,
        layers: 'radar,satellite,temperatures,wind-particles,precipitation,clouds',
        timeline: {
          from: -2 * 3600,
          to: 0
        }
      });
    });
    return { success: true, map };
  } catch (error) {
    console.error('Error initializing AerisWeather map:', error);
    return { success: false, error: error.message };
  }
};