export const addCloudsLayer = (map) => {
  map.addSource('clouds', {
    type: 'raster',
    tiles: [`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`],
    tileSize: 512,
    maxzoom: 18
  });

  map.addLayer({
    id: 'clouds',
    type: 'raster',
    source: 'clouds',
    paint: {
      'raster-opacity': 0.8,
      'raster-fade-duration': 0
    },
    layout: { visibility: 'none' }
  });
};