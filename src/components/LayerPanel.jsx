import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Input } from './ui/input';

const LayerPanel = ({ isOpen, onClose, map }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const layers = [
    { id: 'radar', label: 'Radar' },
    { id: 'satellite', label: 'Satellite' },
    { id: 'temperatures', label: 'Temperature' },
    { id: 'wind-particles', label: 'Wind' },
    { id: 'precipitation', label: 'Precipitation' },
    { id: 'clouds', label: 'Clouds' },
  ];

  const handleLayerToggle = (layerId) => {
    if (map) {
      const layer = map.getLayer(layerId);
      if (layer) {
        layer.setVisible(!layer.isVisible());
      } else {
        map.addLayer(layerId);
      }
    }
  };

  const handleOpacityChange = (layerId, opacity) => {
    if (map) {
      const layer = map.getLayer(layerId);
      if (layer) {
        layer.setOpacity(opacity / 100);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

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
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 bg-[#0f172a] border-gray-600"
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </form>
      <div className="space-y-4">
        {layers.map((layer) => (
          <div key={layer.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span>{layer.label}</span>
              <Switch
                checked={map?.getLayer(layer.id)?.isVisible() || false}
                onCheckedChange={() => handleLayerToggle(layer.id)}
              />
            </div>
            <Slider
              defaultValue={[100]}
              max={100}
              step={1}
              className="w-full"
              onValueChange={(value) => handleOpacityChange(layer.id, value[0])}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default LayerPanel;