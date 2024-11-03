import { API_CONFIG, API_KEYS } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const fetchFromTerrabox = async (endpoint) => {
  const url = `${API_CONFIG.TERRABOX.BASE_URL}/${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEYS.TERRABOX}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching from Terrabox (${endpoint}):`, error);
    return null;
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.WEATHER_LAYERS);
    if (!response.ok) {
      throw new Error('Failed to fetch weather layers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather layers:', error);
    toast({
      title: "Error",
      description: "Failed to fetch weather layers. Using fallback data.",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchTrainingData = async () => {
  try {
    const response = await fetch(API_CONFIG.ENDPOINTS.TRAINING_DATA);
    if (!response.ok) {
      throw new Error('Failed to fetch training data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching training data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch training data. Using fallback data.",
      variant: "destructive",
    });
    return {
      trainingSet: [],
      validationSet: [],
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalSamples: 0,
        accuracy: 0
      }
    };
  }
};

export const fetchMastomysLocations = async () => {
  try {
    const data = await fetchFromTerrabox(API_CONFIG.ENDPOINTS.MASTOMYS_LOCATIONS);
    if (!data) {
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [3.379206, 6.524379]
            },
            properties: {
              id: 1,
              confidence: 0.95,
              timestamp: new Date().toISOString()
            }
          }
        ]
      };
    }
    return data;
  } catch (error) {
    console.error('Error fetching Mastomys locations:', error);
    toast({
      title: "Error",
      description: "Failed to fetch Mastomys locations. Using mock data.",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const data = await fetchFromTerrabox(API_CONFIG.ENDPOINTS.CASES);
    if (!data) {
      return [
        {
          id: 1,
          latitude: 6.524379,
          longitude: 3.379206,
          severity: 'high'
        }
      ];
    }
    return data;
  } catch (error) {
    console.error('Error fetching Lassa fever cases:', error);
    toast({
      title: "Error",
      description: "Failed to fetch Lassa fever cases. Using mock data.",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchWeatherData = async (lat, lon) => {
  const url = `${API_CONFIG.FALLBACK.OPENWEATHER}&lat=${lat}&lon=${lon}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch weather data",
      variant: "destructive",
    });
    return {
      temperature: 25,
      humidity: 60,
      rainfall: 100
    };
  }
};

export const fetchEnvironmentalData = async () => {
  try {
    const [terraboxData, trainingData] = await Promise.all([
      fetchFromTerrabox(API_CONFIG.ENDPOINTS.ENVIRONMENTAL),
      fetchTrainingData()
    ]);

    const data = terraboxData || {
      populationTrend: [
        { month: 'Jan', actual: 4000, predicted: 4400 },
        { month: 'Feb', actual: 3000, predicted: 3200 },
        { month: 'Mar', actual: 2000, predicted: 2400 },
        { month: 'Apr', actual: 2780, predicted: 2900 },
        { month: 'May', actual: 1890, predicted: 2100 },
        { month: 'Jun', actual: 2390, predicted: 2500 }
      ],
      habitatSuitability: [
        { area: 'Forest', suitability: 80 },
        { area: 'Grassland', suitability: 65 },
        { area: 'Urban', suitability: 30 },
        { area: 'Wetland', suitability: 75 }
      ]
    };

    // Merge training data with environmental data if available
    if (trainingData) {
      data.trainingMetrics = trainingData.metadata;
    }

    return data;
  } catch (error) {
    console.error('Error fetching environmental data:', error);
    toast({
      title: "Error",
      description: "Failed to fetch environmental data. Using mock data.",
      variant: "destructive",
    });
    return null;
  }
};
