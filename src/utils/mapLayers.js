export const addWeatherLayers = (map) => {
  if (!map) return;

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
    }
  ];
  
  layers.forEach(layer => {
    try {
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
          layout: {
            visibility: 'none'
          },
          paint: {
            'raster-opacity': 0.8
          }
        });
      }
    } catch (error) {
      console.error(`Error adding layer ${layer.id}:`, error);
    }
  });
};

export const addAdminBoundariesLayer = (map) => {
  if (!map) return;

  try {
    if (!map.getSource('admin-boundaries')) {
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
    }
  } catch (error) {
    console.error('Error adding admin boundaries layer:', error);
  }
};

export const addCustomLayers = (map) => {
  if (!map) return;
  
  map.on('style.load', () => {
    addWeatherLayers(map);
    addAdminBoundariesLayer(map);
  });
};