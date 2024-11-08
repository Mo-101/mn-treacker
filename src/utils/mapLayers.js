import mapboxgl from 'mapbox-gl';

const addWeatherLayers = (map) => {
  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  const layers = [
    {
      id: 'precipitation',
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.8,
      height: 2000,
      minZoom: 0
    },
    {
      id: 'temperature',
      url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.7,
      height: 1000,
      minZoom: 0
    },
    {
      id: 'clouds',
      url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.6,
      height: 8000,
      minZoom: 0
    },
    {
      id: 'wind',
      url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.7,
      height: 3000,
      minZoom: 0
    }
  ];
  
  layers.forEach(layer => {
    if (!map.getSource(layer.id)) {
      map.addSource(layer.id, {
        type: 'raster',
        tiles: [layer.url],
        tileSize: 256,
        maxzoom: layer.maxzoom,
        minZoom: layer.minZoom
      });

      map.addLayer({
        id: layer.id,
        type: 'raster',
        source: layer.id,
        layout: { visibility: 'visible' },
        paint: { 
          'raster-opacity': layer.opacity,
          'raster-opacity-transition': {
            duration: 300
          },
          'raster-brightness-min': 0.2,
          'raster-brightness-max': 1,
          'raster-contrast': 0,
          'raster-resampling': 'linear',
          'raster-fade-duration': 300
        }
      });
    }
  });
};

export const initializeLayers = (map) => {
  if (!map) return;

  map.on('load', () => {
    addWeatherLayers(map);
  });
};

export const updateLayerHeight = (map, layerId, height) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-height', height);
  }
};

export const setLayerOpacity = (map, layerId, opacity) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
  }
};