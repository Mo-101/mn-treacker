import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Card, CardContent } from '../ui/card';

const TrainingControlsPanel = () => {
  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Training Controls</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Learning Rate</label>
            <Slider defaultValue={[0.001]} max={0.1} step={0.001} />
          </div>
          <div>
            <label className="block mb-2">Batch Size</label>
            <Slider defaultValue={[32]} max={128} step={1} />
          </div>
          <Button className="w-full">Start Training</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingControlsPanel;