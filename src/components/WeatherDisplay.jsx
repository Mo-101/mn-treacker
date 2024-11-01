import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplet, Wind, Cloud } from 'lucide-react';
import { Card } from './ui/card';

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return null;

  const {
    hourly_units: units,
    properties: {
      temperature_2m_best_match: temperature,
      relative_humidity_2m_best_match: humidity,
      wind_speed_10m_best_match: windSpeed,
      cloud_cover_best_match: cloudCover,
      precipitation_best_match: precipitation,
      timezone,
      elevation
    }
  } = weatherData;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gray-900/80 backdrop-blur-md rounded-lg shadow-xl"
    >
      <h2 className="text-xl font-bold text-yellow-400 mb-4">Weather Conditions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-black/40 border-yellow-400/20">
          <div className="flex items-center space-x-2">
            <Thermometer className="text-yellow-400 h-5 w-5" />
            <div>
              <p className="text-sm text-gray-400">Temperature</p>
              <p className="text-lg text-white">{temperature}°C</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-black/40 border-yellow-400/20">
          <div className="flex items-center space-x-2">
            <Droplet className="text-yellow-400 h-5 w-5" />
            <div>
              <p className="text-sm text-gray-400">Humidity</p>
              <p className="text-lg text-white">{humidity}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-black/40 border-yellow-400/20">
          <div className="flex items-center space-x-2">
            <Wind className="text-yellow-400 h-5 w-5" />
            <div>
              <p className="text-sm text-gray-400">Wind Speed</p>
              <p className="text-lg text-white">{windSpeed} km/h</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-black/40 border-yellow-400/20">
          <div className="flex items-center space-x-2">
            <Cloud className="text-yellow-400 h-5 w-5" />
            <div>
              <p className="text-sm text-gray-400">Cloud Cover</p>
              <p className="text-lg text-white">{cloudCover}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-black/40 border-yellow-400/20">
          <div className="flex items-center space-x-2">
            <Droplet className="text-yellow-400 h-5 w-5" />
            <div>
              <p className="text-sm text-gray-400">Precipitation</p>
              <p className="text-lg text-white">{precipitation} mm</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-black/40 border-yellow-400/20">
          <div>
            <p className="text-sm text-gray-400">Location Info</p>
            <p className="text-lg text-white">{timezone}</p>
            <p className="text-sm text-gray-400">Elevation: {elevation}m</p>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default WeatherDisplay;