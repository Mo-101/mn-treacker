import React from 'react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const layerInfo = {
  'Vegetation': 'Shows vegetation density and distribution',
  'Soil Moisture': 'Displays soil moisture levels from satellite data',
  'Water Sources': 'Maps natural and artificial water bodies',
  'Detection Data': 'Historical detection points and patterns'
};

const InteractiveSidebar = () => {
  return (
    <div className="w-full sm:w-64 md:w-72 lg:w-80 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md p-4 overflow-y-auto shadow-xl border border-yellow-400/10 min-h-screen transition-all duration-300 ease-in-out">
      <h3 className="text-xl font-bold mb-6 text-yellow-400 tracking-tight">
        Data Layers
      </h3>
      <div className="space-y-6">
        {Object.entries(layerInfo).map(([layer, info]) => (
          <div key={layer} className="space-y-3 bg-black/40 p-4 rounded-lg border border-yellow-400/20 shadow-lg transform transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-medium">{layer}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-yellow-400/60 hover:text-yellow-400 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{info}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch 
                className="data-[state=checked]:bg-yellow-400"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-yellow-400/80 text-sm">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveSidebar;