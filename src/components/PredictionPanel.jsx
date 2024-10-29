import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplet, Wind } from 'lucide-react';
import { Button } from './ui/button';
import MiniMap from './MiniMap';

const PredictionPanel = ({ isOpen, onClose, onDetailView }) => {
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
      className="fixed right-0 top-0 h-full w-112 bg-gray-900 text-white p-6 overflow-y-auto z-50 shadow-lg"
    >
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
        X
      </Button>
      <h2 className="text-3xl font-bold mb-6">Mastomys Habitat & Risk Assessment</h2>
      <MiniMap />
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Population Trend</h3>
        <div className="flex space-x-4 mb-4">
          {['weekly', 'monthly', 'yearly'].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              onClick={() => setTimeframe(tf)}
              className="text-sm"
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </Button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={populationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Habitat Suitability</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={habitatData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="area" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="suitability" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Environmental Trends</h3>
        <div className="flex justify-between text-lg">
          <div className="flex items-center">
            <Thermometer className="mr-2 text-red-500 h-6 w-6" />
            <span>+2.5°C</span>
          </div>
          <div className="flex items-center">
            <Droplet className="mr-2 text-blue-500 h-6 w-6" />
            <span>-5% Humidity</span>
          </div>
          <div className="flex items-center">
            <Wind className="mr-2 text-green-500 h-6 w-6" />
            <span>+10% Vegetation</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Risk Summary</h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="mb-2"><strong>Highest Predicted Risk:</strong> Urban areas near water sources</p>
          <p className="mb-2"><strong>Newly Identified Hotspots:</strong> 3 locations in grasslands</p>
          <p><strong>Habitat Suitability Change:</strong> +15% in forest regions</p>
        </div>
      </div>
      <Button onClick={onDetailView} className="w-full text-lg py-3">View Details on Main Map</Button>
    </motion.div>
  );
};

export default PredictionPanel;