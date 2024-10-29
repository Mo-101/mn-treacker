import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Brain } from 'lucide-react';

const TrainingControlsPanel = ({ 
  onStartTraining, 
  isTraining, 
  trainingProgress, 
  dataUploaded,
  trainingActivities,
  timeLeft,
  elapsedTime
}) => {
  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Brain className="mr-2 h-6 w-6" />
          Training Controls
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Learning Rate</label>
            <Slider defaultValue={[0.001]} max={0.1} step={0.001} />
          </div>
          <div>
            <label className="block mb-2">Batch Size</label>
            <Slider defaultValue={[32]} max={128} step={1} />
          </div>
          <Button 
            className={`w-full ${dataUploaded ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} transition-colors duration-200`}
            onClick={onStartTraining}
            disabled={isTraining || !dataUploaded}
          >
            {isTraining ? 'Training in Progress...' : 'Start Training'}
          </Button>
          {isTraining && (
            <div className="space-y-2">
              <Progress value={trainingProgress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-300">
                <span>Progress: {trainingProgress}%</span>
                <span>Time Left: {timeLeft}s</span>
              </div>
              <div className="mt-4 max-h-40 overflow-y-auto bg-gray-900 p-2 rounded">
                <h3 className="text-sm font-semibold mb-2">Training Activities:</h3>
                {trainingActivities.map((activity, index) => (
                  <p key={index} className="text-xs text-gray-300 mb-1">
                    {activity}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingControlsPanel;