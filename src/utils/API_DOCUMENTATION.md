# API Documentation

## Available Endpoints

### Upload Dataset
- **Endpoint**: `/api/upload-dataset`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Description**: Upload datasets for training (supports CSV and GeoJSON formats)
- **Response**: 
  - Success (200): `{ message: string }`
  - Error (400): `{ error: string }`

### Training Progress
- **Endpoint**: `/api/training-progress`
- **Method**: GET
- **Description**: Check training progress and get model status
- **Response**: 
```typescript
{
  progress: number;      // 0-100
  is_training: boolean;
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1?: number;
  }
}
```

### Rat Locations
- **Endpoint**: `/api/rat-locations`
- **Method**: GET
- **Description**: Fetch rat location data
- **Response**: GeoJSON FeatureCollection

### Lassa Fever Cases
- **Endpoint**: `/api/cases`
- **Method**: GET
- **Description**: Get Lassa fever cases data
- **Response**: GeoJSON FeatureCollection

### Weather Data
- **Endpoint**: `/api/weather-data`
- **Method**: GET
- **Parameters**: 
  - lat: number (latitude)
  - lon: number (longitude)
- **Description**: Retrieve weather data for predictive analysis
- **Response**: Weather data object

## Environment Variables

Add these variables to your `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

## Usage Examples

```typescript
// Upload dataset
const file = event.target.files[0];
await uploadDataset(file);

// Get training progress
const { progress, isTraining, metrics } = useTrainingProgress();

// Fetch rat locations
const ratLocations = await fetchRatLocations();

// Fetch Lassa fever cases
const cases = await fetchLassaFeverCases();

// Get weather data
const weatherData = await fetchWeatherData(9.082, 8.6753);
```