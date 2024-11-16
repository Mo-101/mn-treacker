export const addPrecipitationLayer = (map) => {
  map.addSource('precipitation', {
    type: 'raster',
    tiles: [`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`],
    tileSize: 512,
    maxzoom: 18
  });

  map.addLayer({
    id: 'precipitation',
    type: 'raster',
    source: 'precipitation',
    paint: {
      'raster-opacity': 0.8,
      'raster-fade-duration': 0
    },
    layout: { visibility: 'none' }
  });
};