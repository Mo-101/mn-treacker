import React from 'react';
import { Thermometer, CloudRain, Wind, Cloud } from 'lucide-react';
import { Slider } from './ui/slider';
import { X } from 'lucide-react';

const WeatherControls = ({ activeLayers, onLayerToggle, layerOpacity, onOpacityChange }) => {
  const layers = [
    { 
      id: 'weather-temperature', 
      name: 'Temperature',
      icon: Thermometer,
      description: 'High-resolution temperature data'
    },
    { 
      id: 'weather-precipitation', 
      name: 'Precipitation',
      icon: CloudRain,
      description: 'Shows rainfall intensity'
    },
    { 
      id: 'weather-wind', 
      name: 'Wind Speed',
      icon: Wind,
      description: 'Wind patterns and speed'
    },
    { 
      id: 'weather-clouds', 
      name: 'Cloud Cover',
      icon: Cloud,
      description: 'Cloud coverage data'
    }
  ];

  return (
    <div className="absolute top-16 left-4 bg-gray-900/95 p-6 rounded-lg shadow-lg w-80 text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-yellow-400">Weather Layers</h3>
        <button onClick={() => {}} className="text-gray-400 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-6">
        {layers.map((layer) => (
          <div 
            key={layer.id}
            className="space-y-2 bg-black/40 p-4 rounded-lg border border-yellow-400/20"
          >
            <div className="flex items-center gap-2">
              <layer.icon className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">{layer.name}</span>
            </div>
            <p className="text-sm text-gray-400">{layer.description}</p>
            <Slider
              value={[activeLayers.includes(layer.id) ? layerOpacity : 0]}
              onValueChange={(value) => {
                if (value[0] > 0 && !activeLayers.includes(layer.id)) {
                  onLayerToggle(layer.id);
                } else if (value[0] === 0 && activeLayers.includes(layer.id)) {
                  onLayerToggle(layer.id);
                }
                onOpacityChange(value[0]);
              }}
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

export default WeatherControls;