import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';

const LeftSidePanel = ({ isOpen, onClose, activeLayer, onLayerChange, onSearch }) => {
  const layers = [
    { id: 'vegetation', label: 'Vegetation' },
    { id: 'soilMoisture', label: 'Soil Moisture' },
    { id: 'waterSources', label: 'Water Sources' },
    { id: 'humanDensity', label: 'Human Density' },
    { id: 'diseaseData', label: 'Disease Data' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: '-100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full w-64 bg-black/70 backdrop-blur-lg text-white p-4 z-30"
    >
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
        <X className="h-5 w-5" />
      </Button>
      <h2 className="text-xl font-bold mb-4">Layers & Filters</h2>
      <Input 
        placeholder="Search for sightings..." 
        className="mb-4"
        onChange={(e) => onSearch(e.target.value)}
      />
      {layers.map((layer) => (
        <motion.div 
          key={layer.id} 
          className="flex items-center justify-between mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span>{layer.label}</span>
          <Switch 
            checked={activeLayer === layer.id}
            onCheckedChange={() => onLayerChange(layer.id)}
          />
        </motion.div>
      ))}
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Opacity</h3>
        <Slider defaultValue={[100]} max={100} step={1} />
      </div>
    </motion.div>
  );
};

export default LeftSidePanel;