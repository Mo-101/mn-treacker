import React from 'react';
import { motion } from 'framer-motion';

const NewsScroll = ({ weatherData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 overflow-hidden"
    >
      <div className="flex items-center space-x-4 animate-scroll">
        {weatherData ? (
          <>
            <span>Current Weather: {weatherData.weather[0].description}</span>
            <span>Temperature: {weatherData.main.temp}°C</span>
            <span>Humidity: {weatherData.main.humidity}%</span>
            <span>Wind Speed: {weatherData.wind.speed} m/s</span>
          </>
        ) : (
          <span>Loading weather data...</span>
        )}
      </div>
    </motion.div>
  );
};

export default NewsScroll;