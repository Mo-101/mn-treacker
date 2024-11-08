import mapboxgl from 'mapbox-gl';

const addWeatherLayers = (map) => {
  const layers = [
    {
      id: 'precipitation',
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.8,
      height: 2000
    },
    {
      id: 'temperature',
      url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.7,
      height: 1000
    },
    {
      id: 'clouds',
      url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.6,
      height: 8000
    },
    {
      id: 'wind',
      url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.7,
      height: 3000
    }
  ];
  
  layers.forEach(layer => {
    if (!map.getSource(layer.id)) {
      map.addSource(layer.id, {
        type: 'raster',
        tiles: [layer.url],
        tileSize: 256,
        maxzoom: layer.maxzoom
      });

      map.addLayer({
        id: layer.id,
        type: 'raster',
        source: layer.id,
        layout: { visibility: 'visible' },
        paint: { 
          'raster-opacity': layer.opacity,
          'raster-height': layer.height,
          'raster-resampling': 'linear'
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