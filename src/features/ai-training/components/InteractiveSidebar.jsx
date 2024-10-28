import React from 'react';
import { Slider } from '../../../components/ui/slider';
import { Switch } from '../../../components/ui/switch';
import { Input } from '../../../components/ui/input';

const InteractiveSidebar = () => {
  return (
    <div className="w-64 bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-white">Data Layers</h3>
      <div className="space-y-4">
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-2 block">Data Source</label>
          <Input 
            value="https://terabox.com/s/1XqnU4Y9S2p_WPFu1YeIe8A"
            readOnly
            className="text-xs"
          />
        </div>
        {['Vegetation', 'Soil Moisture', 'Water Sources', 'Detection Data'].map((layer) => (
          <div key={layer} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white">{layer}</span>
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