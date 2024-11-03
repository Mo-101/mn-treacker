export const weatherLayerConfigs = {
  precipitation: {
    id: 'precipitation',
    url: (apiKey) => `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    maxzoom: 20,
    height: 2000,
    paint: {
      'raster-opacity': 0.8,
      'raster-fade-duration': 0,
      'raster-brightness-min': 0.2,
      'raster-brightness-max': 1,
      'raster-saturation': 1.2,
      'raster-contrast': 0.5,
      'raster-resampling': 'linear'
    }
  },
  temperature: {
    id: 'temperature',
    url: (apiKey) => `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    maxzoom: 20,
    height: 1000,
    paint: {
      'raster-opacity': 0.85,
      'raster-fade-duration': 0,
      'raster-brightness-min': 0.2,
      'raster-brightness-max': 1,
      'raster-saturation': 1.5,
      'raster-contrast': 0.8,
      'raster-resampling': 'linear'
    }
  },
  clouds: {
    id: 'clouds',
    url: (apiKey) => `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    maxzoom: 20,
    height: 8000,
    paint: {
      'raster-opacity': 0.75,
      'raster-fade-duration': 0,
      'raster-brightness-min': 0.3,
      'raster-brightness-max': 1,
      'raster-saturation': 1.2,
      'raster-contrast': 0.6,
      'raster-resampling': 'linear'
    }
  },
  wind: {
    id: 'wind',
    url: (apiKey) => `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    maxzoom: 20,
    height: 3000,
    paint: {
      'raster-opacity': 0.8,
      'raster-fade-duration': 0,
      'raster-brightness-min': 0.2,
      'raster-brightness-max': 1,
      'raster-saturation': 1.3,
      'raster-contrast': 0.7,
      'raster-resampling': 'linear'
    }
  }
};