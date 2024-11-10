import AerisWeather from '@aerisweather/javascript-sdk';

export const initializeAerisWeather = (container, mapState, onReady, onError) => {
  const aeris = new AerisWeather(import.meta.env.VITE_XWEATHER_ID, import.meta.env.VITE_XWEATHER_SECRET);

  return aeris.views().then(views => {
    const map = new views.InteractiveMap(container, {
      center: {
        lat: mapState.lat,
        lon: mapState.lng
      },
      zoom: mapState.zoom,
      layers: 'blue-marble:blend(multiply),fradar-hrrr:70:blend(overlay),radar-global:70:blend(overlay),satellite-infrared-color:70:blend(overlay),humidity-rtma:blend(grain-merge),temperatures:90:blend(grain-merge),water-depth:blend(grain-merge),rivers:blend(overlay),admin-cities-dk:blend(overlay)',
      timeline: {
        from: -2 * 3600,
        to: 0
      }
    });

    map.on('load', onReady);
    return map;
  }).catch(onError);
};

export const toggleAerisLayer = (map, layerId, isVisible) => {
  if (map && map.layers) {
    map.layers.setLayerVisibility(layerId, isVisible);
  }
};

export const setAerisLayerOpacity = (map, layerId, opacity) => {
  if (map && map.layers) {
    map.layers.setLayerOpacity(layerId, opacity / 100);
  }
};

export const toggleAerisAnimation = (map) => {
  if (map && map.timeline) {
    map.timeline.toggle();
  }
};