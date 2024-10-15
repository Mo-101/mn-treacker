let cachedWeatherData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export const getCachedWeatherData = () => {
  if (cachedWeatherData && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedWeatherData;
  }
  return null;
};

export const cacheWeatherData = (data) => {
  cachedWeatherData = data;
  lastFetchTime = Date.now();
};