import React from 'react';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { apiClient, PREDICTION_TYPES } from '../utils/apiClient';
import type { ModelType, TrainingDataSource } from '../types/api';

const APIControls = () => {
  const { toast } = useToast();
  const [modelType, setModelType] = React.useState<ModelType>('cnn');
  const [dataSource, setDataSource] = React.useState<TrainingDataSource>('satellite_imagery');
  const [augmentationEnabled, setAugmentationEnabled] = React.useState(false);

  const handleConfigureModel = async () => {
    try {
      await apiClient.configureAdaptiveLearning({
        model_type: modelType,
        training_data_source: dataSource,
        hyperparameters: {
          learning_rate: 0.01,
          batch_size: 32
        },
        augmentation_enabled: augmentationEnabled
      });

      toast({
        title: "Success",
        description: "Model configured successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to configure model",
        variant: "destructive",
      });
    }
  };

  const handleDetectAnomalies = async () => {
    try {
      const result = await apiClient.detectAnomalies({
        input_data: "sample_data",
        model_used: modelType,
        geospatial_analysis: true,
        overlays: {
          location_coordinates: {} as any,
          image_data: "",
          environmental_data: {} as any,
          habitat_suitability: {} as any
        },
        output_format: 'geojson'
      });

      if (result.prediction_success) {
        toast({
          title: "Detection Complete",
          description: `Found ${result.predicted_locations.length} potential locations`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to detect anomalies",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Model Type</label>
        <Select value={modelType} onValueChange={(value: ModelType) => setModelType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select model type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PREDICTION_TYPES).map((type) => (
              <SelectItem key={type} value={type}>
                {type.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Data Source</label>
        <Select value={dataSource} onValueChange={(value: TrainingDataSource) => setDataSource(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="satellite_imagery">Satellite Imagery</SelectItem>
            <SelectItem value="multispectral">Multispectral</SelectItem>
            <SelectItem value="LiDAR">LiDAR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Enable Augmentation</label>
        <Switch
          checked={augmentationEnabled}
          onCheckedChange={setAugmentationEnabled}
        />
      </div>

      <div className="space-x-4">
        <Button onClick={handleConfigureModel}>
          Configure Model
        </Button>
        <Button onClick={handleDetectAnomalies} variant="secondary">
          Detect Anomalies
        </Button>
      </div>
    </div>
  );
};

export default APIControls;