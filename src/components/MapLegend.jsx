import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Thermometer, Cloud, Wind } from 'lucide-react';

const MapLegend = ({ activeLayers }) => {
  const legends = [
    {
      id: 'precipitation',
      icon: CloudRain,
      name: 'Precipitation',
      gradient: 'from-blue-500 to-purple-500',
      scale: ['0mm', '25mm', '50mm+']
    },
    {
      id: 'temp',
      icon: Thermometer,
      name: 'Temperature',
      gradient: 'from-blue-500 via-yellow-500 to-red-500',
      scale: ['0°C', '25°C', '50°C']
    },
    {
      id: 'clouds',
      icon: Cloud,
      name: 'Cloud Cover',
      gradient: 'from-gray-300 to-gray-700',
      scale: ['0%', '50%', '100%']
    },
    {
      id: 'wind',
      icon: Wind,
      name: 'Wind Speed',
      gradient: 'from-green-300 to-green-700',
      scale: ['0km/h', '25km/h', '50km/h']
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-black/70 backdrop-blur-sm p-2 rounded-lg"
    >
      {legends.map((legend) => (
        activeLayers.includes(legend.id) && (
          <div key={legend.id} className="flex flex-col items-center text-xs text-yellow-400">
            <legend.icon className="h-4 w-4 mb-1" />
            <span className="mb-1">{legend.name}</span>
            <div className={`w-20 h-2 bg-gradient-to-r ${legend.gradient} rounded`} />
            <div className="flex justify-between w-full mt-1">
              {legend.scale.map((value, index) => (
                <span key={index}>{value}</span>
              ))}
            </div>
          </div>
        )
      ))}
    </motion.div>
  );
};

export default MapLegend;