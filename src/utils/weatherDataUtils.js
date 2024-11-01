export const processWeatherData = (data) => {
  if (!data?.features?.[0]) return null;

  const feature = data.features[0];
  return {
    type: feature.type,
    geometry: feature.geometry,
    properties: {
      ...feature.properties,
      temperature_2m_best_match: parseFloat(feature.properties.hourly_units.temperature_2m_best_match),
      relative_humidity_2m_best_match: parseFloat(feature.properties.hourly_units.relative_humidity_2m_best_match),
      wind_speed_10m_best_match: parseFloat(feature.properties.hourly_units.wind_speed_10m_best_match),
      cloud_cover_best_match: parseFloat(feature.properties.hourly_units.cloud_cover_best_match),
      precipitation_best_match: parseFloat(feature.properties.hourly_units.precipitation_best_match)
    },
    hourly_units: feature.properties.hourly_units
  };
};

export const filterWeatherByTime = (data, timestamp) => {
  if (!data?.features) return null;
  
  return {
    ...data,
    features: data.features.filter(feature => 
      feature.properties.hourly_units.time.includes(timestamp)
    )
  };
};