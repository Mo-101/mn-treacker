import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { WiDaySunny, WiThermometer, WiHumidity } from 'react-icons/wi';

const insights = [
  { icon: WiDaySunny, text: "Average sighting density: 3.2 per km²", color: "#FFD700" },
  { icon: WiThermometer, text: "Temperature trend: +1.5°C over 5 years", color: "#FF6347" },
  { icon: WiHumidity, text: "Habitat moisture: 12% increase in the last decade", color: "#4169E1" },
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
    <div className="fixed bottom-0 left-0 right-0 bg-black text-yellow-400 py-2 overflow-hidden z-30 border-t-2 border-yellow-400">
      <div ref={scrollRef} className="whitespace-nowrap">
        {insights.concat(insights).map((insight, index) => (
          <motion.span
            key={index}
            className="inline-flex items-center mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <insight.icon className="mr-2 text-2xl" style={{ color: insight.color }} />
            </motion.div>
            <span className="text-sm font-semibold" style={{ color: insight.color }}>{insight.text}</span>
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default FloatingInsightsBar;