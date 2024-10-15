export const createToggleOpenWeatherLayer = (map, setShowOpenWeather) => {
  return () => {
    const visibility = map.getLayoutProperty('openWeatherTemperatureLayer', 'visibility') === 'visible' ? 'none' : 'visible';
    map.setLayoutProperty('openWeatherTemperatureLayer', 'visibility', visibility);
    setShowOpenWeather(visibility === 'visible');
  };
};