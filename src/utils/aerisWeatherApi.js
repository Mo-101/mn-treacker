import AerisWeather from '@aerisweather/javascript-sdk';

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
    console.error('Error initializing AerisWeather map:', error);
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
    console.error('Error toggling layer:', error);
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
    console.error('Error setting layer opacity:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to safely extract data from a Request object
const extractRequestData = (request) => {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
      // Only include safe headers
      headers: Object.fromEntries([...request.headers].filter(([key]) => {
        const safeHeaders = ['content-type', 'accept', 'content-length'];
        return safeHeaders.includes(key.toLowerCase());
      }))
    };
  }
  return String(request);
};

// Wrap fetch to handle errors without cloning the Request object
const safeFetch = async (...args) => {
  try {
    const response = await fetch(...args);
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      // Extract safe request data before reporting
      const requestData = extractRequestData(args[0]);
      if (typeof window.reportHTTPError === 'function') {
        window.reportHTTPError({
          message: error.message,
          request: requestData
        });
      }
      throw error;
    }
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Replace global fetch with our safe version
window.fetch = safeFetch;