import React from 'react';
import { Card, CardContent } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ModelPerformanceDashboard = () => {
  const performanceData = [
    { name: 'Precision', value: 0.89 },
    { name: 'Recall', value: 0.92 },
    { name: 'F1 Score', value: 0.90 },
    { name: 'AUC-ROC', value: 0.95 },
  ];

  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Model Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#333', border: 'none' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceDashboard;