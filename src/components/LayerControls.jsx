import React from 'react';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { toggleAerisLayer, setAerisLayerOpacity } from '../utils/aerisWeatherApi';

const LayerControls = ({ layers, activeLayers, setActiveLayers, layerOpacity, setLayerOpacity }) => {
  const handleLayerToggle = async (layerId) => {
    const isEnabled = !activeLayers.includes(layerId);
    const result = await toggleAerisLayer(layerId, isEnabled);
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
      const result = await setAerisLayerOpacity(layerId, opacity / 100);
      if (!result.success) {
        console.error(`Failed to set opacity for ${layerId} layer:`, result.error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {layers.map((layer) => (
        <div key={layer.id} className="flex items-center justify-between">
          <span>{layer.name}</span>
          <Switch
            checked={activeLayers.includes(layer.id)}
            onCheckedChange={() => handleLayerToggle(layer.id)}
          />
        </div>
      ))}
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