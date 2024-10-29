import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { useToast } from '../ui/use-toast';

const TrainingControlsPanel = ({ 
  onStartTraining, 
  isTraining, 
  trainingProgress, 
  dataUploaded,
  trainingActivities,
  timeLeft,
  elapsedTime
}) => {
  const { toast } = useToast();

  useEffect(() => {
    if (isTraining) {
      toast({
        title: "AI Training Status",
        description: `Training in progress: ${trainingProgress}% complete`,
      });
    }
  }, [trainingProgress, isTraining, toast]);

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
          <Button 
            className={`w-full ${dataUploaded ? 'animate-pulse bg-green-500 hover:bg-green-600' : ''}`}
            onClick={onStartTraining}
            disabled={isTraining || !dataUploaded}
          >
            {isTraining ? 'Training in Progress...' : 'Start Training'}
          </Button>
          {isTraining && (
            <div>
              <Progress value={trainingProgress} className="h-2 mb-2" />
              <p className="text-sm text-gray-300 mt-2">Training Progress: {trainingProgress}%</p>
              <p className="text-sm text-gray-300">Time Left: {timeLeft}s</p>
              <p className="text-sm text-gray-300">Elapsed Time: {elapsedTime}s</p>
            </div>
          )}
          <div className="mt-4 max-h-40 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">Training Activities</h3>
            {trainingActivities.map((activity, index) => (
              <p key={index} className="text-sm text-gray-300">{activity}</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingControlsPanel;