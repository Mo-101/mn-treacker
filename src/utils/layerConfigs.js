export const getLayerConfig = (layerType, opacity, OPENWEATHER_API_KEY) => {
  const configs = {
    precipitation: {
      tiles: [`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
      paint: { 'raster-opacity': opacity }
    },
    temp_new: {
      tiles: [`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
      paint: { 'raster-opacity': opacity }
    },
    clouds_new: {
      tiles: [`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
      paint: { 'raster-opacity': opacity }
    },
    radar: {
      tiles: [`https://tile.openweathermap.org/map/radar/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
      paint: { 
        'raster-opacity': opacity,
        'raster-fade-duration': 0
      }
    }
  };
  
  return configs[layerType];
};