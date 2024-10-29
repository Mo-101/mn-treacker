export const addWeatherLayers = (map) => {
  const layers = [
    {
      id: 'temperature',
      url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20
    },
    {
      id: 'precipitation',
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20
    },
    {
      id: 'clouds',
      url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20
    },
    {
      id: 'wind',
      url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20
    },
    {
      id: 'pressure',
      url: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20
    }
  ];
  
  layers.forEach(layer => {
    map.addSource(`weather-${layer.id}`, {
      type: 'raster',
      tiles: [layer.url],
      tileSize: 256,
      maxzoom: layer.maxzoom
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
        'raster-fade-duration': 0
      }
    });
  });
};

export const addAdminBoundariesLayer = (map) => {
  map.addSource('admin-boundaries', {
    type: 'vector',
    url: 'mapbox://mapbox.boundaries-adm2-v3'
  });

  map.addLayer({
    id: 'admin-boundaries-layer',
    type: 'line',
    source: 'admin-boundaries',
    'source-layer': 'boundaries_admin_2',
    paint: {
      'line-color': 'rgba(255, 255, 255, 0.5)',
      'line-width': 1
    },
    layout: {
      visibility: 'visible'
    }
  });
};

export const addCustomLayers = (map) => {
  addWeatherLayers(map);
  addAdminBoundariesLayer(map);
};