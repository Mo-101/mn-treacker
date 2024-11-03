import React from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

const WeatherControls = ({ activeLayers, onLayerToggle, layerOpacity, onOpacityChange }) => {
  const layers = [
    { id: 'radar', name: 'Radar' },
    { id: 'satellite', name: 'Satellite' },
    { id: 'temperatures', name: 'Temperature' },
    { id: 'wind-particles', name: 'Wind' },
    { id: 'precipitation', name: 'Precipitation' },
    { id: 'clouds', name: 'Clouds' },
  ];

  return (
    <div className="absolute top-16 left-4 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Weather Layers</h3>
      <div className="space-y-2">
        {layers.map((layer) => (
          <Button
            key={layer.id}
            onClick={() => onLayerToggle(layer.id)}
            variant={activeLayers.includes(layer.id) ? 'default' : 'outline'}
            className="w-full"
          >
            {layer.name}
          </Button>
        ))}
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-1">Layer Opacity</h4>
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

export default WeatherControls;