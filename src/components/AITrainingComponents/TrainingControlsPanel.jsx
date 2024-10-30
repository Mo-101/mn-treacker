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
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Training Controls</h2>
        <div className="space-y-4">
          <div className="bg-black/40 p-3 rounded-lg">
            <label className="block mb-2 text-yellow-400">Learning Rate</label>
            <div className="flex items-center justify-between text-yellow-400 text-sm mb-1">
              <span>0.001</span>
              <span>0.1</span>
            </div>
            <Slider 
              defaultValue={[0.001]} 
              max={0.1} 
              step={0.001}
              className="[&_.relative]:bg-yellow-400/20 [&_[role=slider]]:bg-yellow-400 [&_[role=slider]]:border-yellow-400 [&_.absolute]:bg-yellow-400"
            />
          </div>
          <div className="bg-black/40 p-3 rounded-lg">
            <label className="block mb-2 text-yellow-400">Batch Size</label>
            <div className="flex items-center justify-between text-yellow-400 text-sm mb-1">
              <span>1</span>
              <span>128</span>
            </div>
            <Slider 
              defaultValue={[32]} 
              max={128} 
              step={1}
              className="[&_.relative]:bg-yellow-400/20 [&_[role=slider]]:bg-yellow-400 [&_[role=slider]]:border-yellow-400 [&_.absolute]:bg-yellow-400"
            />
          </div>
          <Button 
            className={`w-full bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 ${dataUploaded ? 'animate-pulse' : ''}`}
            onClick={onStartTraining}
            disabled={isTraining || !dataUploaded}
          >
            {isTraining ? 'Training in Progress...' : 'Start Training'}
          </Button>
          {isTraining && (
            <div>
              <Progress value={trainingProgress} className="mb-2 bg-yellow-400/20 [&>div]:bg-yellow-400" />
              <p className="text-sm text-yellow-400">Training Progress: {trainingProgress}%</p>
              <p className="text-sm text-yellow-400">Time Left: {timeLeft}s</p>
              <p className="text-sm text-yellow-400">Elapsed Time: {elapsedTime}s</p>
            </div>
          )}
          <div className="mt-4 max-h-40 overflow-y-auto bg-black/40 p-3 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">Training Activities</h3>
            {trainingActivities.map((activity, index) => (
              <p key={index} className="text-sm text-yellow-400/80">{activity}</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingControlsPanel;