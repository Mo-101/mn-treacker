import { 
  fetchEnvironmentalData, 
  fetchLassaFeverCases, 
  fetchRatLocations, 
  fetchWeatherData 
} from './api';

export const testAllEndpoints = async () => {
  const results = {
    environmental: false,
    cases: false,
    ratLocations: false,
    weather: false
  };

  try {
    // Test environmental data endpoint
    const envData = await fetchEnvironmentalData();
    results.environmental = !!envData;
    console.log('Environmental data fetch:', results.environmental ? 'SUCCESS' : 'FAILED');

    // Test cases endpoint
    const casesData = await fetchLassaFeverCases();
    results.cases = !!casesData;
    console.log('Cases data fetch:', results.cases ? 'SUCCESS' : 'FAILED');

    // Test rat locations endpoint
    const ratData = await fetchRatLocations();
    results.ratLocations = !!ratData;
    console.log('Rat locations fetch:', results.ratLocations ? 'SUCCESS' : 'FAILED');

    // Test weather endpoint
    const weatherData = await fetchWeatherData(0, 0);
    results.weather = !!weatherData;
    console.log('Weather data fetch:', results.weather ? 'SUCCESS' : 'FAILED');

  } catch (error) {
    console.error('API Test Error:', error);
  }

  return results;
};