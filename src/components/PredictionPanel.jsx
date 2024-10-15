import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplet, Wind, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import MiniMap from './MiniMap';

const PredictionPanel = ({ isOpen, onClose, onDetailView, ratSightings, predictions, weatherData }) => {
  const [timeframe, setTimeframe] = useState('weekly');

  useEffect(() => {
    // Add rat sightings and predictions to the mini map
    // This is a placeholder, implement actual logic to add markers to MiniMap
  }, [ratSightings, predictions]);

  const renderAlert = (type, message) => (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-2 rounded-md ${type === 'sighting' ? 'bg-red-500' : 'bg-green-500'} text-white mb-2`}
    >
      <AlertTriangle className="inline-block mr-2" />
      {message}
    </motion.div>
  );

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
      
      <MiniMap ratSightings={ratSightings} predictions={predictions} />
      
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Alerts</h3>
        {ratSightings.map((sighting, index) => renderAlert('sighting', `Rat sighting at ${sighting.location}`))}
        {predictions.map((prediction, index) => renderAlert('prediction', `High-risk area predicted at ${prediction.location}`))}
      </div>

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
          <LineChart data={ratSightings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Environmental Factors</h3>
        <div className="flex justify-between text-lg">
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
        </div>
      </div>

      <Button onClick={onDetailView} className="w-full text-lg py-3">View Details on Main Map</Button>
    </motion.div>
  );
};

export default PredictionPanel;