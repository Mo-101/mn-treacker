import React from 'react';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Card } from '../ui/card';

const InteractiveSidebar = () => {
  return (
    <div className="w-64 bg-gray-900/95 backdrop-blur-lg p-6 overflow-y-auto border-r border-yellow-500/20 shadow-2xl">
      <h3 className="text-xl font-bold mb-6 text-yellow-400 tracking-wide">Data Layers</h3>
      
      <div className="space-y-6">
        {['Vegetation', 'Soil Moisture', 'Water Sources', 'Detection Data'].map((layer) => (
          <Card 
            key={layer} 
            className="p-4 bg-gray-800/50 border border-yellow-500/20 rounded-xl 
                     shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]
                     transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-medium">{layer}</span>
                <Switch className="data-[state=checked]:bg-yellow-500" />
              </div>
              
              <div className="pt-2">
                <Slider
                  defaultValue={[100]}
                  max={100}
                  step={1}
                  className="w-full"
                  thumbClassName="bg-yellow-400 border-2 border-yellow-600 shadow-lg
                               hover:shadow-yellow-400/50 transition-shadow duration-200"
                  trackClassName="bg-yellow-500/30"
                />
                <div className="mt-1 flex justify-between text-xs text-yellow-400/60">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
        <h4 className="text-yellow-400 font-semibold mb-2">Layer Information</h4>
        <p className="text-yellow-400/70 text-sm">
          Adjust layer visibility and opacity using the controls above.
        </p>
      </div>
    </div>
  );
};

export default InteractiveSidebar;