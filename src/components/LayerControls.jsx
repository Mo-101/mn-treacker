import React from 'react';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Mountain, Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
import { weatherLayers } from '../utils/weatherLayerConfig';

const LayerControls = ({ activeLayers, setActiveLayers, layerOpacity, setLayerOpacity, onLayerToggle, onOpacityChange }) => {
  const layerIcons = {
    temp_new: Thermometer,
    precipitation_new: Droplets,
    clouds_new: Cloud,
    wind_new: Wind,
    terrain: Mountain
  };

  const handleLayerToggle = async (layerId) => {
    const isEnabled = !activeLayers.includes(layerId);
    const result = await onLayerToggle(layerId, isEnabled);
    if (result.success) {
      setActiveLayers(prev => 
        isEnabled ? [...prev, layerId] : prev.filter(id => id !== layerId)
      );
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
      {weatherLayers.map((layer) => {
        const Icon = layerIcons[layer.id] || Cloud;
        return (
          <div key={layer.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <span>{layer.name}</span>
            </div>
            <Switch
              checked={activeLayers.includes(layer.id)}
              onCheckedChange={() => handleLayerToggle(layer.id)}
            />
          </div>
        );
      })}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Layer Opacity</h3>
        <Slider
          value={[layerOpacity]}
          onValueChange={(value) => onOpacityChange(value[0])}
          max={100}
          step={1}
        />
      </div>
    </div>
  );
};

export default LayerControls;