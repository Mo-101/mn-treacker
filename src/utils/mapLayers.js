export const addWeatherLayers = (map) => {
  const layers = [
    { id: 'temperature', type: 'temp_new' },
    { id: 'precipitation', type: 'precipitation_new' },
    { id: 'clouds', type: 'clouds_new' },
    { id: 'radar', type: 'radar' },
    { id: 'wind', type: 'wind_new' }
  ];
  
  layers.forEach(layer => {
    if (!map.getSource(`weather-${layer.id}`)) {
      map.addSource(`weather-${layer.id}`, {
        type: 'raster',
        tiles: [`https://tile.openweathermap.org/map/${layer.type}/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`],
        tileSize: 256,
        attribution: '© OpenWeatherMap'
      });

      map.addLayer({
        id: `weather-${layer.id}`,
        type: 'raster',
        source: `weather-${layer.id}`,
        layout: {
          visibility: 'none'
        },
        paint: {
          'raster-opacity': 0.8,
          'raster-resampling': 'linear'
        },
        minzoom: 0,
        maxzoom: 22
      });
    }
  });
};

export const addAdminBoundariesLayer = (map) => {
  if (!map.getSource('admin-boundaries')) {
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
  }
};