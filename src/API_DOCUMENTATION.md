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
# Server Configuration
PORT=3000
VITE_FLASK_HOST=http://localhost
VITE_FLASK_PORT=3000
VITE_API_BASE_URL=${VITE_FLASK_HOST}:${VITE_FLASK_PORT}/api

# API Key
VITE_API_KEY=your_api_key_here

# Data Source URLs
VITE_TERABOX_LOCATION_DATA_URL=your_terabox_url
VITE_TERABOX_WEATHER_DATA_URL=your_terabox_url
VITE_TERABOX_CASES_DATA_URL=your_terabox_url
VITE_TERABOX_OTHER_DATA_URL=your_terabox_url

# Backend Data Paths
VITE_POINTS_GEOJSON_PATH=path/to/points.geojson
VITE_WEATHER_GEOJSON_PATH=path/to/weather_data.geojson
VITE_MN_GEOJSON_PATH=path/to/mn.geojson
VITE_SLAYER_GEOJSON_PATH=path/to/slayer.geojson

# CSV Data Paths
VITE_HISTORICAL_CASES_CSV_PATH=path/to/cases.csv
VITE_CLIMATOLOGY_CSV_PATH=path/to/climatology.csv
VITE_ADDRESS_POINTS_PATH=path/to/address_points.csv
VITE_SM19_PATH=path/to/SM19.csv
VITE_SM20_PATH=path/to/SM20.csv
VITE_SM21_PATH=path/to/SM21.csv
VITE_SM22_PATH=path/to/SM22.csv
VITE_SM23_PATH=path/to/SM23.csv

# Additional Data Paths
VITE_METADATA_XML_PATH=path/to/metadata.xml
VITE_THEORY_FILE_PATH=path/to/theory.xlsx

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Endpoints
VITE_TRAINING_API_URL=${VITE_API_BASE_URL}/training-progress
VITE_UPLOAD_DATASET_URL=${VITE_API_BASE_URL}/upload-dataset
VITE_RAT_LOCATIONS_URL=${VITE_API_BASE_URL}/rat-locations
VITE_CASES_DATA_URL=${VITE_API_BASE_URL}/cases
VITE_WEATHER_DATA_URL=${VITE_API_BASE_URL}/weather-data
```

## Usage Examples

```typescript
// Upload dataset
const file = event.target.files[0];
await uploadDataset(file);

// Get training progress
const { progress, isTraining, metrics } = useTrainingProgress();

// Fetch rat locations
const { data: ratLocations } = useRatLocations();

// Fetch Lassa fever cases
const { data: cases } = useLassaFeverCases();

// Get weather data
const { data: weatherData } = useWeatherData(9.082, 8.6753);
```

## Security Note

Never commit the actual `.env` file to version control. Always use `.env.example` as a template with placeholder values.