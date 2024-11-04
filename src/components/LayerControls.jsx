import React from 'react';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Mountain, Cloud, Droplets, Wind, Thermometer } from 'lucide-react';

const LayerControls = ({ layers, activeLayers, setActiveLayers, layerOpacity, setLayerOpacity, onLayerToggle, onOpacityChange }) => {
  const layerIcons = {
    terrain: Mountain,
    clouds: Cloud,
    precipitation: Droplets,
    wind: Wind,
    temperature: Thermometer
  };

  const handleLayerToggle = async (layerId) => {
    const isEnabled = !activeLayers.includes(layerId);
    const result = await onLayerToggle(layerId, isEnabled);
    if (result.success) {
      setActiveLayers(prev => 
        isEnabled ? [...prev, layerId] : prev.filter(id => id !== layerId)
      );
    } else {
      console.error(`Failed to toggle ${layerId} layer:`, result.error);
    }
  };

  const handleOpacityChange = async (opacity) => {
    setLayerOpacity(opacity);
    for (const layerId of activeLayers) {
      const result = await onOpacityChange(layerId, opacity / 100);
      if (!result.success) {
        console.error(`Failed to set opacity for ${layerId} layer:`, result.error);
      }
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
      {layers.map((layer) => {
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
          onValueChange={(value) => handleOpacityChange(value[0])}
          max={100}
          step={1}
        />
      </div>
    </div>
  );
};

export default LayerControls;