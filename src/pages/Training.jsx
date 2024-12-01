import React from 'react';
import { motion } from 'framer-motion';
import AITrainingInterface from '../components/AITrainingInterface';

const Training = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-900"
    >
      <AITrainingInterface />
    </motion.div>
  );
};

export default Training;