import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { useToast } from '../ui/use-toast';
import { apiClient } from '../../utils/apiClient';

const TrainingControlsPanel = ({ 
  onStartTraining, 
  isTraining, 
  trainingProgress, 
  dataUploaded,
  trainingActivities,
  timeLeft,
  elapsedTime
}) => {
  const [learningRate, setLearningRate] = useState(0.001);
  const [batchSize, setBatchSize] = useState(32);
  const { toast } = useToast();

  const handleStartTraining = async () => {
    try {
      const config = {
        model_type: 'cnn',
        training_data_source: 'satellite_imagery',
        hyperparameters: {
          learning_rate: learningRate,
          batch_size: batchSize
        },
        augmentation_enabled: true
      };

      await apiClient.configureAdaptiveLearning(config);
      onStartTraining();
      
      toast({
        title: "Training Started",
        description: "Model training has been initiated successfully."
      });
    } catch (error) {
      toast({
        title: "Training Error",
        description: "Failed to start training. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Training Controls</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Learning Rate: {learningRate}</label>
            <Slider 
              defaultValue={[learningRate]} 
              max={0.1} 
              step={0.001}
              onValueChange={(value) => setLearningRate(value[0])}
            />
          </div>
          <div>
            <label className="block mb-2">Batch Size: {batchSize}</label>
            <Slider 
              defaultValue={[batchSize]} 
              max={128} 
              step={1}
              onValueChange={(value) => setBatchSize(value[0])}
            />
          </div>
          <Button 
            className={`w-full ${dataUploaded ? 'animate-pulse bg-green-500 hover:bg-green-600' : ''}`}
            onClick={handleStartTraining}
            disabled={isTraining || !dataUploaded}
          >
            {isTraining ? 'Training...' : 'Start Training'}
          </Button>
          {isTraining && (
            <div>
              <Progress value={trainingProgress} className="h-2" />
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