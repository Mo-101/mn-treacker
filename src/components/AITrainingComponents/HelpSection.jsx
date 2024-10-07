import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

const HelpSection = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Help & Quick Start Guide</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-4">
          <p>Welcome to the AI Training Interface! Here's a quick guide to get you started:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Use the top navigation bar to switch between different sections.</li>
            <li>Upload your data using the Data Upload section.</li>
            <li>Monitor model performance in the Performance Dashboard.</li>
            <li>Visualize your data using the interactive map in the Visualization Panel.</li>
            <li>Adjust training parameters and start training in the Training Controls section.</li>
            <li>Use the sidebar to toggle data layers and adjust visualization settings.</li>
            <li>Check the bottom console for logs and notifications.</li>
          </ol>
          <p>For more detailed information, please refer to the user manual or contact support.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpSection;