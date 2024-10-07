import React from 'react';

const BottomConsole = () => {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-2 h-24 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-2">Console Logs</h3>
      <div className="text-xs space-y-1">
        <p>[INFO] Data upload completed successfully.</p>
        <p>[WARN] Model training initiated. ETA: 2 hours.</p>
        <p>[ERROR] API connection failed. Retrying in 5 seconds.</p>
      </div>
    </div>
  );
};

export default BottomConsole;