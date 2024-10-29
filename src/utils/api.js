import { fetchWithErrorHandling } from './apiHelpers';

const API_BASE_URL = '/api'; // Changed from 'http://localhost:5000/api'

export const fetchRatLocations = () => fetchWithErrorHandling(`${API_BASE_URL}/rat-locations`);

export const fetchLassaFeverCases = () => fetchWithErrorHandling(`${API_BASE_URL}/cases`);

export const fetchWeatherData = (lat, lon, layer = 'weather') => 
  fetchWithErrorHandling(`${API_BASE_URL}/openweather?lat=${lat}&lon=${lon}&layer=${layer}`);

export const startTraining = () => 
  fetchWithErrorHandling(`${API_BASE_URL}/start-training`, { method: 'POST' });

export const getTrainingProgress = () => 
  fetchWithErrorHandling(`${API_BASE_URL}/training-progress`);

export const fetchDatasets = () => fetchWithErrorHandling(`${API_BASE_URL}/datasets`);

export const uploadDataset = (formData) => 
  fetchWithErrorHandling(`${API_BASE_URL}/upload-dataset`, {
    method: 'POST',
    body: formData,
  });

export const fetchModelPerformance = () => fetchWithErrorHandling(`${API_BASE_URL}/model-performance`);

export const fetchPredictions = () => fetchWithErrorHandling(`${API_BASE_URL}/predictions`);

export const fetchHabitatSuitability = () => fetchWithErrorHandling(`${API_BASE_URL}/habitat-suitability`);