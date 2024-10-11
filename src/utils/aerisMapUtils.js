import AerisWeather from '@aerisweather/javascript-sdk';

export const initializeAerisMap = (containerId, mapState, addToConsoleLog) => {
  const aeris = new AerisWeather(
    process.env.REACT_APP_AERIS_CLIENT_ID,
    process.env.REACT_APP_AERIS_CLIENT_SECRET
  );

  return new Promise((resolve, reject) => {
    aeris.apps().then((apps) => {
      const map = new apps.InteractiveMapApp(containerId, {
        map: {
          strategy: 'mapbox',
          accessToken: process.env.VITE_MAPBOX_TOKEN,
          zoom: mapState.zoom,
          center: {
            lat: mapState.lat,
            lon: mapState.lng
          }
        },
        layers: {
          radar: { zIndex: 1 },
          satellite: { zIndex: 2 },
          temperatures: { zIndex: 3 },
          'wind-particles': { zIndex: 4 },
          precipitation: { zIndex: 5 },
          clouds: { zIndex: 6 },
        }
      });

      map.on('ready', () => {
        addToConsoleLog('AerisWeather map initialized');
        resolve(map);
      });
    }).catch(error => {
      console.error('Error initializing Aeris Weather SDK:', error);
      reject(error);
    });
  });
};

export const cleanupAerisMap = (map) => {
  if (map) {
    map.destroy();
  }
};

export const toggleAerisLayer = (map, layerId, visible) => {
  if (map && map.layers) {
    map.layers.setLayerVisibility(layerId, visible);
  }
};

export const setAerisLayerOpacity = (map, layerId, opacity) => {
  if (map && map.layers) {
    map.layers.setLayerOpacity(layerId, opacity);
  }
};