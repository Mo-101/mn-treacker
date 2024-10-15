import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplet, Wind, Cloud, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import MiniMap from './MiniMap';

const PredictionPanel = ({ isOpen, onClose, onLayerToggle, activeLayers, weatherData, habitatPredictions }) => {
  const weatherLayers = [
    { id: 'radar', name: 'Radar', icon: Cloud },
    { id: 'satellite', name: 'Satellite', icon: Sun },
    { id: 'precipitation', name: 'Precipitation', icon: Droplet },
    { id: 'temperature', name: 'Temperature', icon: Thermometer },
    { id: 'wind', name: 'Wind', icon: Wind },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-112 bg-gray-900 text-white p-6 overflow-y-auto z-50 shadow-lg"
    >
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
        X
      </Button>
      <h2 className="text-3xl font-bold mb-6">Mastomys Habitat & Risk Assessment</h2>
      <MiniMap habitatPredictions={habitatPredictions} />
      
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Weather Layers</h3>
        {weatherLayers.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between mb-2">
            <span className="flex items-center">
              <layer.icon className="mr-2 h-5 w-5" />
              {layer.name}
            </span>
            <Switch
              checked={activeLayers.includes(layer.id)}
              onCheckedChange={() => onLayerToggle(layer.id)}
            />
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Current Weather</h3>
        {weatherData && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Thermometer className="mr-2 text-red-500 h-6 w-6" />
              <span>{weatherData.temperature}°C</span>
            </div>
            <div className="flex items-center">
              <Droplet className="mr-2 text-blue-500 h-6 w-6" />
              <span>{weatherData.humidity}% Humidity</span>
            </div>
            <div className="flex items-center">
              <Wind className="mr-2 text-green-500 h-6 w-6" />
              <span>{weatherData.windSpeed} km/h</span>
            </div>
            <div className="flex items-center">
              <Cloud className="mr-2 text-gray-500 h-6 w-6" />
              <span>{weatherData.cloudCover}% Cloud Cover</span>
            </div>
            <div className="flex items-center">
              <Droplet className="mr-2 text-blue-300 h-6 w-6" />
              <span>{weatherData.precipitation} mm Precipitation</span>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Habitat Suitability Prediction</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={habitatPredictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="area" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="suitability" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Risk Summary</h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="mb-2"><strong>Highest Predicted Risk:</strong> {habitatPredictions[0]?.area}</p>
          <p className="mb-2"><strong>Risk Level:</strong> {habitatPredictions[0]?.suitability}%</p>
          <p><strong>Recommendation:</strong> {
            habitatPredictions[0]?.suitability > 80 
              ? "Immediate action required. Implement preventive measures."
              : habitatPredictions[0]?.suitability > 60
                ? "Monitor closely and prepare for potential increase in Mastomys activity."
                : "Continue routine monitoring."
          }</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionPanel;
