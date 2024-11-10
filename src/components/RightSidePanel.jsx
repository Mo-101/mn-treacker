import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RightSidePanel = ({ isOpen, onClose, selectedPoint }) => {
  const mockData = [
    { name: 'Week 1', value: 30 },
    { name: 'Week 2', value: 45 },
    { name: 'Week 3', value: 35 },
    { name: 'Week 4', value: 60 },
    { name: 'Week 5', value: 40 },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
      className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 z-30 
                 overflow-y-auto shadow-2xl"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-red-500/5 pointer-events-none" />

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="absolute top-4 right-4 hover:bg-white/10 transition-colors"
      >
        <X className="h-5 w-5" />
      </Button>

      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300">
        Risk Assessment
      </h2>

      {selectedPoint ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-4 bg-white/5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <MapPin className="h-5 w-5" />
              <h3 className="font-semibold">Location Details</h3>
            </div>
            <p>Latitude: {selectedPoint.latitude}</p>
            <p>Longitude: {selectedPoint.longitude}</p>
            <p>Sighting Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg space-y-4">
            <h3 className="font-semibold text-amber-400">Population Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#666"
                    tick={{ fill: '#999' }}
                  />
                  <YAxis 
                    stroke="#666"
                    tick={{ fill: '#999' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-semibold">Risk Analysis</h3>
            </div>
            <p className="text-sm">Based on current data, there's a 65% chance of increased activity in this area.</p>
          </div>
        </motion.div>
      ) : (
        <p className="text-center text-gray-400 mt-8">Select a point on the map to view details</p>
      )}

      <motion.div
        className="mt-8"
        whileHover={{ scale: 1.02 }}
      >
        <Button 
          className="w-full bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600
                     text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg
                     hover:shadow-amber-500/25"
          onClick={() => console.log('Export map snapshot')}
        >
          <Download className="mr-2 h-4 w-4" /> Export Snapshot
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default RightSidePanel;