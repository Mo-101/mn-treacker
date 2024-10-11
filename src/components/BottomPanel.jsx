import React from 'react';
import { motion } from 'framer-motion';

const BottomPanel = ({ consoleLog }) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 z-20 max-h-32 overflow-y-auto"
    >
      <h3 className="text-sm font-semibold mb-1">Console Log</h3>
      <div className="text-xs space-y-1">
        {consoleLog.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </motion.div>
  );
};

export default BottomPanel;