import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { useToast } from '../ui/use-toast';
import { Timer, Brain, Activity } from 'lucide-react';

const TrainingControlsPanel = ({ 
  onStartTraining, 
  isTraining, 
  trainingProgress, 
  dataUploaded,
  trainingActivities = []
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(300); // 5 minutes default
  const { toast } = useToast();

  useEffect(() => {
    let timer;
    if (isTraining) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setEstimatedTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTraining]);

  useEffect(() => {
    if (trainingProgress === 100) {
      toast({
        title: "Training Complete",
        description: `Training completed in ${elapsedTime} seconds`,
      });
    }
  }, [trainingProgress, elapsedTime, toast]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Training Controls</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-yellow-400">Learning Rate</label>
            <Slider defaultValue={[0.001]} max={0.1} step={0.001} />
          </div>
          <div>
            <label className="block mb-2 text-yellow-400">Batch Size</label>
            <Slider defaultValue={[32]} max={128} step={1} />
          </div>
          <Button 
            className={`w-full ${dataUploaded ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'}`}
            onClick={onStartTraining}
            disabled={isTraining || !dataUploaded}
          >
            <Brain className="mr-2 h-4 w-4" />
            {isTraining ? 'Training in Progress...' : 'Start Training'}
          </Button>

          {isTraining && (
            <div className="space-y-4">
              <Progress value={trainingProgress} className="h-2" />
              <div className="flex justify-between text-yellow-400">
                <div className="flex items-center">
                  <Timer className="mr-2 h-4 w-4" />
                  <span>Elapsed: {formatTime(elapsedTime)}</span>
                </div>
                <div className="flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  <span>ETA: {formatTime(estimatedTimeLeft)}</span>
                </div>
              </div>
              <div className="text-yellow-400">
                Progress: {trainingProgress.toFixed(1)}%
              </div>
            </div>
          )}

          <div className="mt-4 max-h-40 overflow-y-auto space-y-2">
            <h3 className="text-lg font-semibold text-yellow-400">Training Activities</h3>
            {trainingActivities.map((activity, index) => (
              <p key={index} className="text-sm text-yellow-400/80 bg-black/20 p-2 rounded">
                {activity}
              </p>
            ))}
            {trainingActivities.length === 0 && (
              <p className="text-sm text-yellow-400/60 italic">
                No training activities yet
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingControlsPanel;