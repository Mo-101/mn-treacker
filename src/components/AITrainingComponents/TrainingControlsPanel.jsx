import React from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Brain, Activity } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const TrainingControlsPanel = ({ 
  onStartTraining, 
  isTraining, 
  trainingProgress, 
  dataUploaded,
  trainingActivities = []
}) => {
  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Training Controls</h2>
        <div className="space-y-4">
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
                  <Activity className="mr-2 h-4 w-4" />
                  <span>Progress: {trainingProgress.toFixed(1)}%</span>
                </div>
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