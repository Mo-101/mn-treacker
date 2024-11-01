export const processWeatherData = (data) => {
  return {
    type: 'FeatureCollection',
    features: data.features.map(feature => ({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        ...feature.properties,
        timestamp: new Date(feature.properties.timestamp),
        temperature: parseFloat(feature.properties.temperature),
        precipitation: parseFloat(feature.properties.precipitation),
        humidity: parseFloat(feature.properties.humidity),
        windSpeed: parseFloat(feature.properties.wind_speed)
      }
    }))
  };
};

export const filterWeatherByYear = (data, year) => {
  return {
    type: 'FeatureCollection',
    features: data.features.filter(feature => 
      new Date(feature.properties.timestamp).getFullYear() === year
    )
  };
};