export const fetchMastomysData = async (setMastomysData, addToConsoleLog) => {
  try {
    addToConsoleLog('Fetching Mastomys data...');
    // Implement Mastomys data fetching logic here
    // For example:
    // const response = await fetch('/api/mastomys-data');
    // const data = await response.json();
    // setMastomysData(data);
  } catch (error) {
    console.error('Error fetching Mastomys data:', error.message);
    addToConsoleLog('Failed to fetch Mastomys data');
  }
};

// Add any other non-AerisWeather specific utility functions here

export const updatePredictionLayer = (map, predictionData) => {
  if (map.getSource('prediction-hotspots')) {
    map.getSource('prediction-hotspots').setData({
      type: 'FeatureCollection',
      features: predictionData.map(point => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.lng, point.lat]
        },
        properties: {
          risk: point.risk
        }
      }))
    });
  }
};

export const formatWeatherData = (data) => {
  // Implement weather data formatting logic here
  // This function can be used to format raw weather data for display
  return {
    temperature: `${data.temperature}°C`,
    humidity: `${data.humidity}%`,
    windSpeed: `${data.windSpeed} km/h`,
    // Add more formatted weather properties as needed
  };
};

export const calculateRiskLevel = (weatherData, mastomysData) => {
  // Implement risk level calculation logic here
  // This function can be used to calculate risk levels based on weather and Mastomys data
  // Return a risk level (e.g., 'low', 'medium', 'high')
};

export const generateHeatmapData = (mastomysData) => {
  // Implement heatmap data generation logic here
  // This function can be used to convert Mastomys data into a format suitable for heatmap visualization
  return mastomysData.map(point => ({
    location: [point.lng, point.lat],
    weight: point.population
  }));
};

export const filterDataByDate = (data, startDate, endDate) => {
  // Implement date filtering logic here
  // This function can be used to filter any dataset based on a date range
  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

export const interpolateData = (data, resolution) => {
  // Implement data interpolation logic here
  // This function can be used to interpolate sparse data points for smoother visualizations
  // The implementation would depend on the specific interpolation method you want to use
};

export const calculateStatistics = (data) => {
  // Implement statistics calculation logic here
  // This function can be used to calculate various statistics from your datasets
  return {
    mean: data.reduce((sum, value) => sum + value, 0) / data.length,
    max: Math.max(...data),
    min: Math.min(...data),
    // Add more statistical calculations as needed
  };
};
