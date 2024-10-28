import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ModelPerformanceDashboard = () => {
  const performanceData = [
    { epoch: 1, accuracy: 0.65, loss: 0.8 },
    { epoch: 2, accuracy: 0.75, loss: 0.6 },
    { epoch: 3, accuracy: 0.82, loss: 0.4 },
    { epoch: 4, accuracy: 0.88, loss: 0.3 },
    { epoch: 5, accuracy: 0.92, loss: 0.2 },
  ];

  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-yellow-400">Model Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="epoch" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#10B981" 
                strokeWidth={2} 
                name="Accuracy"
              />
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke="#EF4444" 
                strokeWidth={2} 
                name="Loss"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceDashboard;