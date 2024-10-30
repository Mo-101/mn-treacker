import React from 'react';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';

const InteractiveSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-yellow-400">Data Layers</h3>
      <div className="space-y-4">
        {['Vegetation', 'Soil Moisture', 'Water Sources', 'Detection Data'].map((layer) => (
          <div key={layer} className="space-y-2 bg-black/40 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400">{layer}</span>
              <Switch className="data-[state=checked]:bg-yellow-400" />
            </div>
            <div className="flex items-center justify-between text-yellow-400 text-sm mb-1">
              <span>0%</span>
              <span>100%</span>
            </div>
            <Slider 
              defaultValue={[100]} 
              max={100} 
              step={1}
              className="[&_.relative]:bg-yellow-400/20 [&_[role=slider]]:bg-yellow-400 [&_[role=slider]]:border-yellow-400 [&_.absolute]:bg-yellow-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveSidebar;