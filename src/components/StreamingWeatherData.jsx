import React from 'react';
import { Cloud, Thermometer, Wind, Droplets } from 'lucide-react';

const StreamingWeatherData = ({ data }) => {
  if (!data) return null;

  return (
    <div className="absolute bottom-16 left-4 bg-black/70 backdrop-blur-sm p-4 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-2 text-yellow-400">Live Weather Data</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Thermometer className="h-4 w-4 text-red-400" />
          <p>Temperature: {Math.round(data.main?.temp - 273.15)}°C</p>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="h-4 w-4 text-blue-400" />
          <p>Humidity: {data.main?.humidity}%</p>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="h-4 w-4 text-cyan-400" />
          <p>Wind Speed: {data.wind?.speed} m/s</p>
        </div>
        <div className="flex items-center space-x-2">
          <Cloud className="h-4 w-4 text-gray-400" />
          <p>Conditions: {data.weather?.[0]?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default StreamingWeatherData;