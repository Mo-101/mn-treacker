import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from './ui/slider';

const BottomPanel = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: isVisible ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-4 z-20"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <Slider 
        defaultValue={[50]} 
        max={100} 
        step={1}
        className="w-full"
      />
      <div className="flex justify-between mt-2 text-white text-sm">
        <span>Jan 2023</span>
        <span>Dec 2023</span>
      </div>
    </motion.div>
  );
};

export default BottomPanel;