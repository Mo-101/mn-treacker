export const processWeatherData = (data) => {
  if (!data) return null;
  
  return {
    temperature: data.main?.temp,
    humidity: data.main?.humidity,
    windSpeed: data.wind?.speed,
    description: data.weather?.[0]?.description,
    icon: data.weather?.[0]?.icon
  };
};

export const filterWeatherByYear = (data, year) => {
  if (!data?.list) return [];
  
  return data.list.filter(item => 
    new Date(item.dt * 1000).getFullYear() === year
  );
};

export const processWeatherLayers = (layers) => {
  if (!layers) return [];
  
  return layers.map(layer => ({
    id: layer.id,
    name: layer.id.charAt(0).toUpperCase() + layer.id.slice(1),
    url: layer.url,
    opacity: 0.7,
    visible: false
  }));
};