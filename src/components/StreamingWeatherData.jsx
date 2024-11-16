import React from 'react';

const StreamingWeatherData = ({ data }) => {
  if (!data) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Live Weather Data</h3>
      <p>Temperature: {data.temperature}°C</p>
      <p>Humidity: {data.humidity}%</p>
      <p>Wind Speed: {data.windSpeed} km/h</p>
    </div>
  );
};

export default StreamingWeatherData;