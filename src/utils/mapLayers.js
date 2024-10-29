export const addWeatherLayers = (map) => {
  const layers = ['temperature', 'precipitation', 'clouds', 'radar', 'wind'];
  
  layers.forEach(layer => {
    map.addSource(`weather-${layer}`, {
      type: 'raster',
      tiles: [`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`],
      tileSize: 256
    });

    map.addLayer({
      id: `weather-${layer}`,
      type: 'raster',
      source: `weather-${layer}`,
      layout: {
        visibility: 'none'
      },
      paint: {
        'raster-opacity': 0.8
      }
    });
  });
};

export const addAdminBoundariesLayer = (map) => {
  map.addSource('admin-boundaries', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-streets-v8'
  });

  map.addLayer({
    id: 'admin-boundaries-layer',
    type: 'line',
    source: 'admin-boundaries',
    'source-layer': 'admin',
    paint: {
      'line-color': 'rgba(0, 0, 0, 0.5)',
      'line-width': 1
    },
    layout: {
      visibility: 'visible'
    }
  });
};