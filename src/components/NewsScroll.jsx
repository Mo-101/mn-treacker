import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "./ui/use-toast";
import { fetchWithErrorHandling } from '../utils/apiHelpers';

const NewsScroll = () => {
  const [weatherData, setWeatherData] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await fetchWithErrorHandling('/api/openweather');
        setWeatherData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch weather data",
          variant: "destructive",
        });
      }
    };

    fetchWeatherData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchWeatherData, 300000);

    return () => clearInterval(interval);
  }, [toast]);

  if (!weatherData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-yellow-400 p-2 overflow-hidden z-50"
    >
      <div className="flex items-center space-x-8 animate-scroll whitespace-nowrap">
        <span>Temperature: {weatherData.main?.temp}°C</span>
        <span>Humidity: {weatherData.main?.humidity}%</span>
        <span>Wind Speed: {weatherData.wind?.speed} m/s</span>
        <span>Weather: {weatherData.weather?.[0]?.description}</span>
        <span>Pressure: {weatherData.main?.pressure} hPa</span>
        <span>Visibility: {weatherData.visibility ? `${weatherData.visibility / 1000} km` : 'N/A'}</span>
        {weatherData.rain && <span>Rain (1h): {weatherData.rain['1h']} mm</span>}
      </div>
    </motion.div>
  );
};

export default NewsScroll;