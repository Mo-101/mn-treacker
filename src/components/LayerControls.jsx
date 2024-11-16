import React from 'react';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { useToast } from './ui/use-toast';
import { CloudRain, Thermometer, Cloud, Wind } from 'lucide-react';

const LayerControls = ({ layers, activeLayers, setActiveLayers, layerOpacity, setLayerOpacity, onLayerToggle, onOpacityChange }) => {
  const { toast } = useToast();

  const handleLayerToggle = async (layerId) => {
    try {
      const isEnabled = !activeLayers.includes(layerId);
      const result = await onLayerToggle(layerId, isEnabled);
      
      if (result.success) {
        setActiveLayers(prev => 
          isEnabled ? [...prev, layerId] : prev.filter(id => id !== layerId)
        );
        
        toast({
          title: `${layerId.charAt(0).toUpperCase() + layerId.slice(1)} Layer`,
          description: isEnabled ? "Layer enabled" : "Layer disabled",
        });
      }
    } catch (error) {
      console.error(`Failed to toggle ${layerId} layer:`, error);
      toast({
        title: "Error",
        description: "Failed to toggle layer",
        variant: "destructive",
      });
    }
  };

  const handleOpacityChange = (value) => {
    setLayerOpacity(value);
    onOpacityChange(value / 100);
  };

  const getLayerIcon = (layerId) => {
    switch (layerId) {
      case 'precipitation':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-red-500" />;
      case 'clouds':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'wind':
        return <Wind className="h-5 w-5 text-cyan-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900/90 backdrop-blur-md rounded-lg">
      {layers.map((layer) => (
        <div key={layer.id} className="space-y-2 bg-black/40 p-3 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {getLayerIcon(layer.id)}
              <span className={activeLayers.includes(layer.id) ? 'text-yellow-400' : 'text-gray-400'}>
                {layer.name}
              </span>
            </span>
            <Switch
              checked={activeLayers.includes(layer.id)}
              onCheckedChange={() => handleLayerToggle(layer.id)}
              className="data-[state=checked]:bg-yellow-400 data-[state=unchecked]:bg-gray-600"
            />
          </div>
          {activeLayers.includes(layer.id) && (
            <div className="mt-2">
              <label className="text-sm text-gray-400 mb-1 block">Opacity</label>
              <Slider
                value={[layerOpacity]}
                onValueChange={(value) => handleOpacityChange(value[0])}
                max={100}
                step={1}
                className="slider-yellow"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LayerControls;