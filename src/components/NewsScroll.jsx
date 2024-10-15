import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NewsScroll = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch news data from an API or use mock data
    const mockNews = [
      "New Lassa Fever case reported in Lagos",
      "Rat control measures intensified in affected areas",
      "Health officials urge public to maintain cleanliness",
      "Research shows promising results for new Lassa Fever treatment"
    ];
    setNews(mockNews);
  }, []);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 overflow-hidden"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex whitespace-nowrap">
        {news.map((item, index) => (
          <span key={index} className="mr-8">{item}</span>
        ))}
      </div>
    </motion.div>
  );
};

export default NewsScroll;