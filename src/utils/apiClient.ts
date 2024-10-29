import { fetchWithErrorHandling } from './apiHelpers';
import type {
  RemoteSensingAugmentation,
  MachineLearningModel,
  RodentHabitatDetection,
  PredictionResult,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mostar.ai/v1';

export const apiClient = {
  // Remote Sensing Augmentation
  async applyAugmentation(data: RemoteSensingAugmentation) {
    return fetchWithErrorHandling(`${API_BASE_URL}/augmentation/remote-sensing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Machine Learning and Detection
  async configureAdaptiveLearning(config: MachineLearningModel) {
    return fetchWithErrorHandling(`${API_BASE_URL}/adaptive-learning`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
  },

  async detectAnomalies(data: RodentHabitatDetection): Promise<PredictionResult> {
    return fetchWithErrorHandling(`${API_BASE_URL}/anomaly-detection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  // Mapping Integrations
  async integrateCesium(data: RodentHabitatDetection) {
    return fetchWithErrorHandling(`${API_BASE_URL}/integration/mapping/cesium`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async integrateCopernicus(data: RodentHabitatDetection) {
    return fetchWithErrorHandling(`${API_BASE_URL}/integration/mapping/copernicus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async integrateSentinel(data: RodentHabitatDetection) {
    return fetchWithErrorHandling(`${API_BASE_URL}/integration/mapping/sentinel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};

export const PREDICTION_TYPES = {
  CNN: 'cnn',
  RANDOM_FOREST: 'random_forest',
  SVM: 'svm',
  LSTM: 'lstm',
  ISOLATION_FOREST: 'isolation_forest'
} as const;

export const OUTPUT_FORMATS = {
  GEOJSON: 'geojson',
  SHAPEFILE: 'shapefile',
  CSV: 'csv'
} as const;