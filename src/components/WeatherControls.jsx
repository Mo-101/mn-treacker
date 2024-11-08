import React from 'react';
import { Thermometer, CloudRain, Wind, Cloud } from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { weatherLayers } from '../utils/weatherLayerConfig';
import { toast } from './ui/use-toast';

const WeatherControls = ({ activeLayers, onLayerToggle, layerOpacity, onOpacityChange }) => {
  const layerIcons = {
    temperature: Thermometer,
    precipitation: CloudRain,
    wind: Wind,
    clouds: Cloud
  };

  const handleLayerToggle = (layerId) => {
    onLayerToggle(layerId);
    const layer = weatherLayers.find(l => l.id === layerId);
    if (layer) {
      toast({
        title: activeLayers.includes(layerId) ? "Layer Hidden" : "Layer Shown",
        description: `${layer.name} layer has been ${activeLayers.includes(layerId) ? 'hidden' : 'shown'}`,
      });
    }
  };

  return (
    <Card className="bg-gray-800/90 backdrop-blur-md text-yellow-400 w-80">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Weather Layers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {weatherLayers.map((layer) => {
          const Icon = layerIcons[layer.id] || Cloud;
          const isActive = activeLayers.includes(layer.id);
          
          return (
            <div 
              key={layer.id}
              className={`space-y-2 p-4 rounded-lg border transition-colors ${
                isActive
                  ? 'bg-black/40 border-yellow-400/20'
                  : 'bg-gray-700/40 border-gray-600/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-yellow-400' : 'text-gray-400'}`} />
                  <span className={isActive ? 'text-yellow-400' : 'text-gray-400'}>
                    {layer.name}
                  </span>
                </div>
                <Switch 
                  checked={isActive}
                  onCheckedChange={() => handleLayerToggle(layer.id)}
                  className="data-[state=checked]:bg-yellow-400 data-[state=unchecked]:bg-gray-600"
                />
              </div>
              <p className="text-sm text-gray-400">{layer.description}</p>
              <Slider
                value={[isActive ? layerOpacity : 0]}
                onValueChange={(value) => onOpacityChange(value[0])}
                max={100}
                step={1}
                className={`${
                  isActive
                    ? '[&_.relative]:bg-yellow-400/20 [&_[role=slider]]:bg-yellow-400 [&_[role=slider]]:border-yellow-400 [&_.absolute]:bg-yellow-400'
                    : '[&_.relative]:bg-gray-600/20 [&_[role=slider]]:bg-gray-500 [&_[role=slider]]:border-gray-500 [&_.absolute]:bg-gray-500'
                }`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default WeatherControls;