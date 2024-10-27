import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
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
        <h2 className="text-2xl font-bold mb-4 text-white">Model Performance</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceDashboard;