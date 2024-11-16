export const addWindLayer = (map) => {
  map.addSource('wind', {
    type: 'raster',
    tiles: [`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`],
    tileSize: 512,
    maxzoom: 18
  });

  map.addLayer({
    id: 'wind',
    type: 'raster',
    source: 'wind',
    paint: {
      'raster-opacity': 0.8,
      'raster-fade-duration': 0
    },
    layout: { visibility: 'none' }
  });
};