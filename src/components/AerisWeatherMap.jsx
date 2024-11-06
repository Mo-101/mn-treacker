import React, { useEffect } from 'react';

const AerisWeatherMap = ({ aerisMap }) => {
  useEffect(() => {
    if (aerisMap) {
      // Additional setup for AerisWeather map if needed
    }
  }, [aerisMap]);

  return null; // This component doesn't render anything, it just manages the map
};

export default AerisWeatherMap;