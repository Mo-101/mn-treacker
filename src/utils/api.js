import { API_CONFIG, API_KEYS } from '../config/apiConfig';
import { toast } from '../components/ui/use-toast';

const fetchWithFallback = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return null;
  }
};

export const fetchWeatherLayers = async () => {
  try {
    const data = await fetchWithFallback(API_CONFIG.ENDPOINTS.WEATHER_LAYERS);
    if (!data) {
      return [{
        id: 'default-weather',
        url: `${API_CONFIG.FALLBACK.OPENWEATHER}&lat={lat}&lon={lon}`,
        type: 'temperature'
      }];
    }
    return data;
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
    const data = await fetchWithFallback(API_CONFIG.ENDPOINTS.TRAINING_DATA);
    return data || {
      trainingSet: [],
      validationSet: [],
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalSamples: 0,
        accuracy: 0
      }
    };
  } catch (error) {
    console.error('Error fetching training data:', error);
    return null;
  }
};

export const fetchMastomysLocations = async () => {
  try {
    const data = await fetchWithFallback(`${API_CONFIG.TERRABOX.BASE_URL}/${API_CONFIG.ENDPOINTS.MASTOMYS_LOCATIONS}`);
    return data || [];
  } catch (error) {
    console.error('Error fetching Mastomys locations:', error);
    return [];
  }
};

export const fetchLassaFeverCases = async () => {
  try {
    const data = await fetchWithFallback(`${API_CONFIG.TERRABOX.BASE_URL}/${API_CONFIG.ENDPOINTS.CASES}`);
    return data || [];
  } catch (error) {
    console.error('Error fetching Lassa fever cases:', error);
    return [];
  }
};

export const fetchEnvironmentalData = async () => {
  try {
    const [terraboxData, trainingData] = await Promise.all([
      fetchWithFallback(`${API_CONFIG.TERRABOX.BASE_URL}/${API_CONFIG.ENDPOINTS.ENVIRONMENTAL}`),
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

    if (trainingData?.metadata) {
      data.trainingMetrics = trainingData.metadata;
    }

    return data;
  } catch (error) {
    console.error('Error fetching environmental data:', error);
    return null;
  }
};