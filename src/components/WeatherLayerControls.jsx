import React from 'react';
import { Button } from './ui/button';

const WeatherLayerControls = ({ showOpenWeather, toggleOpenWeatherLayer }) => {
  return (
    <Button onClick={toggleOpenWeatherLayer}>
      {showOpenWeather ? 'Hide OpenWeather Temperature' : 'Show OpenWeather Temperature'}
    </Button>
  );
};

export default WeatherLayerControls;