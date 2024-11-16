import React from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { useToast } from './ui/use-toast';
import { CloudRain, Thermometer, Cloud, Wind, Radio } from 'lucide-react';

const LayerControls = ({ layers, activeLayers, setActiveLayers, layerOpacity, setLayerOpacity }) => {
  const { toast } = useToast();

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      const isEnabled = !prev.includes(layerId);
      const newLayers = isEnabled 
        ? [...prev, layerId] 
        : prev.filter(id => id !== layerId);
      
      toast({
        title: `${layerId.charAt(0).toUpperCase() + layerId.slice(1)} Layer`,
        description: isEnabled ? "Layer enabled" : "Layer disabled",
      });
      
      return newLayers;
    });
  };

  const handleOpacityChange = (value) => {
    setLayerOpacity(value);
  };

  const getLayerIcon = (layerId) => {
    switch (layerId) {
      case 'precipitation':
        return <CloudRain className="h-5 w-5" />;
      case 'temperature':
        return <Thermometer className="h-5 w-5" />;
      case 'clouds':
        return <Cloud className="h-5 w-5" />;
      case 'wind':
        return <Wind className="h-5 w-5" />;
      case 'radar':
        return <Radio className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900/90 backdrop-blur-md rounded-lg">
      <div className="grid grid-cols-2 gap-2">
        {[
          { id: 'radar', name: 'Radar' },
          { id: 'precipitation', name: 'Precipitation' },
          { id: 'temperature', name: 'Temperature' },
          { id: 'clouds', name: 'Clouds' },
          { id: 'wind', name: 'Wind' }
        ].map((layer) => (
          <Button
            key={layer.id}
            variant={activeLayers.includes(layer.id) ? "default" : "outline"}
            onClick={() => handleLayerToggle(layer.id)}
            className={`flex items-center gap-2 w-full justify-start ${
              activeLayers.includes(layer.id) 
                ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                : 'text-gray-400 hover:text-yellow-400'
            }`}
          >
            <span className={activeLayers.includes(layer.id) ? 'text-black' : 'text-yellow-400'}>
              {getLayerIcon(layer.id)}
            </span>
            {layer.name}
          </Button>
        ))}
      </div>
      
      <div className="mt-4">
        <label className="text-sm text-gray-400 mb-1 block">Layer Opacity</label>
        <Slider
          value={[layerOpacity]}
          onValueChange={([value]) => handleOpacityChange(value)}
          max={100}
          step={1}
          className="slider-yellow"
        />
      </div>
    </div>
  );
};

export default LayerControls;