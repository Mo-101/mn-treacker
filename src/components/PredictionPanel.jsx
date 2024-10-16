import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplet, Wind } from 'lucide-react';
import { Button } from './ui/button';
import MiniMap from './MiniMap';
import { fetchPredictions, fetchHabitatSuitability } from '../utils/api';

const PredictionPanel = ({ isOpen, onClose, onDetailView }) => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [populationData, setPopulationData] = useState([]);
  const [habitatData, setHabitatData] = useState([]);
  const [environmentalTrends, setEnvironmentalTrends] = useState({});
  const [riskSummary, setRiskSummary] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const predictions = await fetchPredictions();
        setPopulationData(predictions.populationTrend);
        setEnvironmentalTrends(predictions.environmentalTrends);
        setRiskSummary(predictions.riskSummary);

        const habitatSuitability = await fetchHabitatSuitability();
        setHabitatData(habitatSuitability);
      } catch (error) {
        console.error('Error fetching prediction data:', error);
      }
    };

    fetchData();
  }, []);

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
            <span>{environmentalTrends.temperature}</span>
          </div>
          <div className="flex items-center">
            <Droplet className="mr-2 text-blue-500 h-6 w-6" />
            <span>{environmentalTrends.humidity}</span>
          </div>
          <div className="flex items-center">
            <Wind className="mr-2 text-green-500 h-6 w-6" />
            <span>{environmentalTrends.vegetation}</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Risk Summary</h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="mb-2"><strong>Highest Predicted Risk:</strong> {riskSummary.highestRisk}</p>
          <p className="mb-2"><strong>Newly Identified Hotspots:</strong> {riskSummary.newHotspots}</p>
          <p><strong>Habitat Suitability Change:</strong> {riskSummary.habitatChange}</p>
        </div>
      </div>
      <Button onClick={onDetailView} className="w-full text-lg py-3">View Details on Main Map</Button>
    </motion.div>
  );
};

export default PredictionPanel;