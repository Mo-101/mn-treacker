import React from 'react';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Input } from './ui/input';

const LeftSidePanel = ({ isOpen, onClose, activeLayers, layerOpacity, onLayerToggle, onOpacityChange }) => {
  const layers = [
    { id: 'radar', label: 'Radar' },
    { id: 'satellite', label: 'Satellite' },
    { id: 'temperatures', label: 'Temperature' },
    { id: 'wind-particles', label: 'Wind' },
    { id: 'precipitation', label: 'Precipitation' },
    { id: 'clouds', label: 'Clouds' },
  ];

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full w-64 bg-[#1e293b] text-white p-4 z-30 overflow-y-auto"
    >
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
        <X className="h-5 w-5" />
      </Button>
      <h2 className="text-xl font-bold mb-4">Map Layers</h2>
      <div className="space-y-4">
        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between">
            <span>{layer.label}</span>
            <Switch
              checked={activeLayers.includes(layer.id)}
              onCheckedChange={() => onLayerToggle(layer.id)}
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Layer Opacity</h3>
        <Slider
          value={[layerOpacity]}
          onValueChange={(value) => onOpacityChange(value[0])}
          max={100}
          step={1}
        />
      </div>
    </motion.div>
  );
};

export default LeftSidePanel;