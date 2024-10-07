import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

const FloatingInsightsButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isOpen ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronUp className="mr-2 h-4 w-4" />}
        Insights
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full right-0 mb-2 w-64 bg-white p-4 rounded-lg shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Data Insights</h3>
            <ul className="list-disc list-inside">
              <li>Average sighting density: 3.2 per km²</li>
              <li>Temperature trend: +1.5°C over 5 years</li>
              <li>Habitat loss: 12% in the last decade</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingInsightsButton;