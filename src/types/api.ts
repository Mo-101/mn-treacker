export type RemoteSensingAugmentationType = 
  | 'image_augmentation'
  | 'geospatial_enhancement'
  | 'noise_filtering'
  | 'temporal_analysis'
  | 'mastomys_natalensis_detection';

export type ModelType = 'cnn' | 'random_forest' | 'svm' | 'lstm' | 'isolation_forest';
export type OutputFormat = 'geojson' | 'shapefile' | 'csv';
export type TrainingDataSource = 'satellite_imagery' | 'multispectral' | 'LiDAR';

export interface RemoteSensingAugmentation {
  augmentation_type: RemoteSensingAugmentationType;
  parameters: {
    resolution?: string;
    additional_param?: string;
  };
}

export interface MastomysNatalensisDetection {
  location_coordinates: RodentHabitatDetection;
  image_data: string; // Base64 encoded
  environmental_data: RodentHabitatDetection;
  habitat_suitability: RodentHabitatDetection;
}

export interface MachineLearningModel {
  model_type: ModelType;
  training_data_source: TrainingDataSource;
  hyperparameters: {
    learning_rate: number;
    batch_size: number;
  };
  augmentation_enabled: boolean;
}

export interface RodentHabitatDetection {
  input_data: string;
  model_used: ModelType;
  geospatial_analysis: boolean;
  overlays: MastomysNatalensisDetection;
  output_format: OutputFormat;
}

export interface PredictionResult {
  prediction_success: boolean;
  predicted_locations: Array<{
    latitude: number;
    longitude: number;
    suitability_score: number;
    confidence: number;
  }>;
}

export interface ErrorResponse {
  error: string;
}