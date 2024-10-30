import React from 'react';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';

const InteractiveSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Data Layers</h3>
      <div className="space-y-4">
        {['Vegetation', 'Soil Moisture', 'Water Sources', 'Detection Data'].map((layer) => (
          <div key={layer} className="space-y-2">
            <div className="flex items-center justify-between">
              <span>{layer}</span>
              <Switch />
            </div>
            <Slider defaultValue={[100]} max={100} step={1} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveSidebar;