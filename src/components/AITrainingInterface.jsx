import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AITrainingInterface = ({ isOpen, onClose }) => {
  const [dataSource, setDataSource] = useState('');
  const [modelAccuracy, setModelAccuracy] = useState(85);
  const [isAutoRetraining, setIsAutoRetraining] = useState(true);

  const performanceData = [
    { name: 'Precision', value: 0.89 },
    { name: 'Recall', value: 0.92 },
    { name: 'F1 Score', value: 0.90 },
  ];

  const handleDataUpload = () => {
    // This would typically involve an API call to the backend
    console.log('Uploading data from:', dataSource);
    // Simulating a response
    setTimeout(() => {
      setModelAccuracy(prev => Math.min(prev + 2, 100));
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-40 h-2/3 overflow-y-auto"
    >
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
        X
      </Button>
      <h2 className="text-2xl font-bold mb-4">AI Training Interface</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Data Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              placeholder="Enter data source URL" 
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleDataUpload}>Upload Data</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={300} height={200} data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider 
              value={[modelAccuracy]}
              max={100}
              step={1}
              className="mb-2"
            />
            <p>Current Accuracy: {modelAccuracy}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auto-Retraining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={isAutoRetraining}
                onCheckedChange={setIsAutoRetraining}
              />
              <span>{isAutoRetraining ? 'Enabled' : 'Disabled'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AITrainingInterface;