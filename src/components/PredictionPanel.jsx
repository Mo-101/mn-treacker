import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplet, Wind } from 'lucide-react';
import { Button } from './ui/button';
import MiniMap from './MiniMap';

const PredictionPanel = ({ isOpen, onClose, predictionData, onDetailView }) => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [populationData, setPopulationData] = useState([]);
  const [habitatData, setHabitatData] = useState([]);
  const [environmentalTrends, setEnvironmentalTrends] = useState({});
  const [riskSummary, setRiskSummary] = useState({});

  useEffect(() => {
    // Simulating real-time data updates
    const updateInterval = setInterval(() => {
      updateData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(updateInterval);
  }, []);

  const updateData = () => {
    // Simulate fetching new data
    setPopulationData(generateRandomData());
    setHabitatData(generateRandomHabitatData());
    setEnvironmentalTrends({
      temperature: (Math.random() * 5 - 2.5).toFixed(1),
      humidity: (Math.random() * 10 - 5).toFixed(1),
      vegetation: (Math.random() * 20 - 10).toFixed(1)
    });
    setRiskSummary({
      highestRisk: ['Urban areas', 'Water sources'][Math.floor(Math.random() * 2)],
      newHotspots: Math.floor(Math.random() * 5),
      habitatChange: (Math.random() * 30 - 15).toFixed(1)
    });
  };

  const generateRandomData = () => {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
      name: month,
      value: Math.floor(Math.random() * 5000)
    }));
  };

  const generateRandomHabitatData = () => {
    return ['Forest', 'Grassland', 'Urban', 'Wetland'].map(area => ({
      area,
      suitability: Math.floor(Math.random() * 100)
    }));
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-112 bg-gray-900 text-white p-6 overflow-y-auto z-50 shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-6">Mastomys Habitat & Risk Assessment</h2>
      <MiniMap predictionData={predictionData} />
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
            <span>{environmentalTrends.temperature}°C</span>
          </div>
          <div className="flex items-center">
            <Droplet className="mr-2 text-blue-500 h-6 w-6" />
            <span>{environmentalTrends.humidity}% Humidity</span>
          </div>
          <div className="flex items-center">
            <Wind className="mr-2 text-green-500 h-6 w-6" />
            <span>{environmentalTrends.vegetation}% Vegetation</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Risk Summary</h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="mb-2"><strong>Highest Predicted Risk:</strong> {riskSummary.highestRisk}</p>
          <p className="mb-2"><strong>Newly Identified Hotspots:</strong> {riskSummary.newHotspots} locations</p>
          <p><strong>Habitat Suitability Change:</strong> {riskSummary.habitatChange}% in forest regions</p>
        </div>
      </div>
      <Button onClick={() => onDetailView(riskSummary.highestRisk)} className="w-full text-lg py-3">
        View Details on Main Map
      </Button>
    </motion.div>
  );
};

export default PredictionPanel;