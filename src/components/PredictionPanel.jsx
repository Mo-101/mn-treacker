import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplet, Wind } from 'lucide-react';
import { Button } from './ui/button';
import MiniMap from './MiniMap';

const PredictionPanel = ({ isOpen, onClose, predictionData, onDetailView }) => {
  const [timeframe, setTimeframe] = useState('weekly');

  const populationData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const habitatData = [
    { area: 'Forest', suitability: 80 },
    { area: 'Grassland', suitability: 65 },
    { area: 'Urban', suitability: 30 },
    { area: 'Wetland', suitability: 75 },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-96 bg-gray-900 text-white p-4 overflow-y-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Mastomys Habitat & Risk Assessment</h2>
      <MiniMap />
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Population Trend</h3>
        <div className="flex space-x-2 mb-2">
          {['weekly', 'monthly', 'yearly'].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              onClick={() => setTimeframe(tf)}
              className="text-xs"
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </Button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={populationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Habitat Suitability</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={habitatData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="area" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="suitability" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Environmental Trends</h3>
        <div className="flex justify-between">
          <div className="flex items-center">
            <Thermometer className="mr-2 text-red-500" />
            <span>+2.5°C</span>
          </div>
          <div className="flex items-center">
            <Droplet className="mr-2 text-blue-500" />
            <span>-5% Humidity</span>
          </div>
          <div className="flex items-center">
            <Wind className="mr-2 text-green-500" />
            <span>+10% Vegetation</span>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Risk Summary</h3>
        <div className="bg-gray-800 p-2 rounded">
          <p><strong>Highest Predicted Risk:</strong> Urban areas near water sources</p>
          <p><strong>Newly Identified Hotspots:</strong> 3 locations in grasslands</p>
          <p><strong>Habitat Suitability Change:</strong> +15% in forest regions</p>
        </div>
      </div>
      <Button onClick={onDetailView} className="w-full">View Details on Main Map</Button>
    </motion.div>
  );
};

export default PredictionPanel;