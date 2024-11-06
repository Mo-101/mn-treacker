import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { CloudRain, Thermometer, Cloud, Wind } from 'lucide-react';

const MapControls = ({ activeLayers, onLayerToggle, layerOpacity, onOpacityChange }) => {
  const controls = [
    { id: 'precipitation', icon: CloudRain, label: 'Precipitation' },
    { id: 'temperature', icon: Thermometer, label: 'Temperature' },
    { id: 'clouds', icon: Cloud, label: 'Cloud Cover' },
    { id: 'wind', icon: Wind, label: 'Wind' }
  ];

  return (
    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm p-4 rounded-lg space-y-4">
      <div className="space-y-2">
        {controls.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={activeLayers.includes(id) ? 'default' : 'outline'}
            className="w-full flex items-center gap-2"
            onClick={() => onLayerToggle(id)}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-white">Layer Opacity</label>
        <Slider
          value={[layerOpacity]}
          onValueChange={([value]) => onOpacityChange(value)}
          max={100}
          step={1}
        />
      </div>
    </div>
  );
};

export default MapControls;