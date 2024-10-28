import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplet, Wind } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import MiniMap from './MiniMap';
import { apiClient } from '../utils/apiClient';

const PredictionPanel = ({ isOpen, onClose, onDetailView }) => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [predictions, setPredictions] = useState([]);
  const [habitatData, setHabitatData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchPredictions();
    }
  }, [isOpen]);

  const fetchPredictions = async () => {
    try {
      const data = {
        prediction_parameters: {
          time_frame: timeframe,
          environmental_data: {
            temperature: true,
            humidity: true,
            vegetation: true
          }
        }
      };

      const response = await apiClient.detectAnomalies(data);
      if (response.prediction_success) {
        setPredictions(response.predicted_locations.map(loc => ({
          name: `${loc.latitude.toFixed(2)}, ${loc.longitude.toFixed(2)}`,
          value: loc.suitability_score * 100
        })));

        setHabitatData([
          { area: 'Forest', suitability: response.habitat_scores?.forest || 80 },
          { area: 'Grassland', suitability: response.habitat_scores?.grassland || 65 },
          { area: 'Urban', suitability: response.habitat_scores?.urban || 30 },
          { area: 'Wetland', suitability: response.habitat_scores?.wetland || 75 },
        ]);
      }
    } catch (error) {
      toast({
        title: "Prediction Error",
        description: "Failed to fetch predictions. Please try again.",
        variant: "destructive"
      });
    }
  };

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
              onClick={() => {
                setTimeframe(tf);
                fetchPredictions();
              }}
              className="text-sm"
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </Button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={predictions}>
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
      <Button onClick={onDetailView} className="w-full text-lg py-3">View Details on Main Map</Button>
    </motion.div>
  );
};

export default PredictionPanel;