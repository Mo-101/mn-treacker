import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DataVisualizationPanel = () => {
  const sampleData = [
    { timestamp: '00:00', predictions: 65, actual: 70 },
    { timestamp: '04:00', predictions: 75, actual: 78 },
    { timestamp: '08:00', predictions: 85, actual: 82 },
    { timestamp: '12:00', predictions: 70, actual: 68 },
    { timestamp: '16:00', predictions: 90, actual: 88 },
    { timestamp: '20:00', predictions: 80, actual: 82 },
  ];

  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Data Visualization</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="timestamp" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="predictions" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualizationPanel;