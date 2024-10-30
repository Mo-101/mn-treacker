import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplet, Wind } from 'lucide-react';
import { Button } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchEnvironmentalData } from '../utils/api';
import MiniMap from './MiniMap';
import { useToast } from './ui/use-toast';

const PredictionPanel = ({ isOpen, onClose, onDetailView }) => {
  const [timeframe, setTimeframe] = useState('weekly');
  const { toast } = useToast();
  
  const { data: environmentalData, isError, isLoading } = useQuery({
    queryKey: ['environmental-data', timeframe],
    queryFn: () => fetchEnvironmentalData(timeframe),
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch environmental data. Using sample data instead.",
        variant: "destructive",
      });
    }
  });

  const populationData = environmentalData?.populationTrend || [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const habitatData = environmentalData?.habitatSuitability || [
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
      className="fixed right-0 top-0 h-full w-112 bg-gray-900 text-yellow-400 p-6 overflow-y-auto z-50 shadow-lg"
    >
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="absolute top-2 right-2 text-yellow-400 hover:bg-yellow-400/10"
      >
        X
      </Button>
      
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
        Mastomys Habitat & Risk Assessment
      </h2>
      
      <div className="bg-black/40 p-4 rounded-lg mb-6">
        <MiniMap />
      </div>

      <div className="mb-6 bg-black/40 p-4 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Population Trend</h3>
        <div className="flex space-x-4 mb-4">
          {['weekly', 'monthly', 'yearly'].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              onClick={() => setTimeframe(tf)}
              className={`text-sm ${timeframe === tf ? 'bg-yellow-400 text-black' : 'text-yellow-400 border-yellow-400/50'}`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </Button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={populationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#facc15" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6 bg-black/40 p-4 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Habitat Suitability</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={habitatData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="area" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="suitability" fill="#facc15" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6 bg-black/40 p-4 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Environmental Trends</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center justify-center bg-black/20 p-3 rounded-lg">
            <Thermometer className="mr-2 text-yellow-400 h-6 w-6" />
            <span>+2.5°C</span>
          </div>
          <div className="flex items-center justify-center bg-black/20 p-3 rounded-lg">
            <Droplet className="mr-2 text-yellow-400 h-6 w-6" />
            <span>-5% Humidity</span>
          </div>
          <div className="flex items-center justify-center bg-black/20 p-3 rounded-lg">
            <Wind className="mr-2 text-yellow-400 h-6 w-6" />
            <span>+10% Vegetation</span>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-black/40 p-4 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Risk Summary</h3>
        <div className="space-y-2">
          <p className="flex justify-between py-2 border-b border-yellow-400/20">
            <strong>Highest Predicted Risk:</strong>
            <span>Urban areas near water sources</span>
          </p>
          <p className="flex justify-between py-2 border-b border-yellow-400/20">
            <strong>Newly Identified Hotspots:</strong>
            <span>3 locations in grasslands</span>
          </p>
          <p className="flex justify-between py-2">
            <strong>Habitat Suitability Change:</strong>
            <span>+15% in forest regions</span>
          </p>
        </div>
      </div>

      <Button 
        onClick={onDetailView} 
        className="w-full text-lg py-3 bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30"
      >
        View Details on Main Map
      </Button>
    </motion.div>
  );
};

export default PredictionPanel;