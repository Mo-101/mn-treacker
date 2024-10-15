import React from 'react';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { Button } from './ui/button';

const RightSidePanel = ({ isOpen, onClose, selectedPoint }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-64 sm:w-72 md:w-80 bg-black/70 backdrop-blur-lg text-white p-4 z-30 overflow-y-auto pointer-events-auto"
    >
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <h2 className="text-lg sm:text-xl font-bold mb-4">Detailed Information</h2>
      {selectedPoint ? (
        <div className="space-y-2 text-sm sm:text-base">
          <p>Latitude: {selectedPoint.latitude}</p>
          <p>Longitude: {selectedPoint.longitude}</p>
          <p>Sighting Date: {new Date().toLocaleDateString()}</p>
          <p>Environmental Conditions: Dry, 28°C</p>
          <p>Correlation with Health Data: 78% match</p>
        </div>
      ) : (
        <p className="text-sm sm:text-base">Select a point on the map to view details.</p>
      )}
      <div className="mt-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2">Predictive Insights</h3>
        <p className="text-xs sm:text-sm">Based on current data, there's a 65% chance of increased Mastomys activity in this area over the next month.</p>
      </div>
      <Button className="mt-4 w-full text-sm sm:text-base" onClick={() => console.log('Export map snapshot')}>
        <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Export Snapshot
      </Button>
    </motion.div>
  );
};

export default RightSidePanel;