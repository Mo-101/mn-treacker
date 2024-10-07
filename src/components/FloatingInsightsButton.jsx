import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { WiDaySunny, WiThermometer, WiTreedown } from 'react-icons/wi';

const insights = [
  { icon: WiDaySunny, text: "Average sighting density: 3.2 per km²" },
  { icon: WiThermometer, text: "Temperature trend: +1.5°C over 5 years" },
  { icon: WiTreedown, text: "Habitat loss: 12% in the last decade" },
];

const FloatingInsightsBar = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const scrollWidth = scrollElement.scrollWidth;
      const animationDuration = scrollWidth / 50; // Adjust speed here

      const animation = scrollElement.animate(
        [
          { transform: 'translateX(100%)' },
          { transform: `translateX(-${scrollWidth}px)` }
        ],
        {
          duration: animationDuration * 1000, // Convert to milliseconds
          iterations: Infinity,
          easing: 'linear'
        }
      );

      return () => {
        if (animation) {
          animation.cancel();
        }
      };
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white py-2 overflow-hidden z-30">
      <div ref={scrollRef} className="whitespace-nowrap">
        {insights.concat(insights).map((insight, index) => (
          <span key={index} className="inline-flex items-center mx-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <insight.icon className="mr-2 text-2xl" />
            </motion.div>
            {insight.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FloatingInsightsBar;