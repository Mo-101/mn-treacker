import React from 'react';
import { Thermometer, CloudRain, Wind, Cloud } from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const WeatherControls = ({ activeLayers, onLayerToggle, layerOpacity, onOpacityChange }) => {
  const layers = [
    { 
      id: 'weather-temperature', 
      name: 'Temperature',
      icon: Thermometer,
      description: 'High-resolution temperature data',
      color: 'text-red-400'
    },
    { 
      id: 'weather-precipitation', 
      name: 'Precipitation',
      icon: CloudRain,
      description: 'Shows rainfall intensity',
      color: 'text-blue-400'
    },
    { 
      id: 'weather-wind', 
      name: 'Wind Speed',
      icon: Wind,
      description: 'Wind patterns and speed',
      color: 'text-cyan-400'
    },
    { 
      id: 'weather-clouds', 
      name: 'Cloud Cover',
      icon: Cloud,
      description: 'Cloud coverage data',
      color: 'text-gray-400'
    }
  ];

  return (
    <Card className="bg-gray-800/90 backdrop-blur-md text-yellow-400 w-80">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Weather Layers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {layers.map((layer) => (
          <div 
            key={layer.id}
            className={`space-y-2 p-4 rounded-lg border transition-colors ${
              activeLayers.includes(layer.id)
                ? 'bg-black/40 border-yellow-400/20'
                : 'bg-gray-700/40 border-gray-600/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <layer.icon className={`h-5 w-5 ${activeLayers.includes(layer.id) ? layer.color : 'text-gray-500'}`} />
                <span className={activeLayers.includes(layer.id) ? 'text-yellow-400' : 'text-gray-400'}>
                  {layer.name}
                </span>
              </div>
              <Switch 
                checked={activeLayers.includes(layer.id)}
                onCheckedChange={() => onLayerToggle(layer.id)}
                className="data-[state=checked]:bg-yellow-400 data-[state=unchecked]:bg-gray-600"
              />
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
              className={`${
                activeLayers.includes(layer.id)
                  ? '[&_.relative]:bg-yellow-400/20 [&_[role=slider]]:bg-yellow-400 [&_[role=slider]]:border-yellow-400 [&_.absolute]:bg-yellow-400'
                  : '[&_.relative]:bg-gray-600/20 [&_[role=slider]]:bg-gray-500 [&_[role=slider]]:border-gray-500 [&_.absolute]:bg-gray-500'
              }`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WeatherControls;