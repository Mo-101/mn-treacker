import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';

const LeftSidePanel = ({ isOpen, onClose, activeLayer, onLayerChange, onSearch }) => {
  const layers = [
    { id: 'vegetation', label: 'Vegetation' },
    { id: 'soil-moisture', label: 'Soil Moisture' },
    { id: 'water-sources', label: 'Water Sources' },
    { id: 'detection-data', label: 'Detection Data' },
  ];

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full w-64 bg-[#1e293b] text-white p-4 z-30"
    >
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
        <X className="h-5 w-5" />
      </Button>
      <h2 className="text-xl font-bold mb-4">Data Layers</h2>
      <div className="space-y-4">
        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between">
            <span>{layer.label}</span>
            <Switch
              checked={activeLayer === layer.id}
              onCheckedChange={() => onLayerChange(layer.id)}
            />
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Layer Opacity</h3>
        <Slider
          defaultValue={[100]}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Data Upload</h3>
        <input
          type="text"
          placeholder="Enter data source URL"
          className="w-full p-2 bg-[#0f172a] border border-gray-600 rounded"
        />
        <Button className="w-full mt-2">Upload from URL</Button>
        <Button className="w-full mt-2">Upload Local Files</Button>
        <Button className="w-full mt-2">Connect to API</Button>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Console Logs</h3>
        <div className="bg-[#0f172a] p-2 rounded h-24 overflow-y-auto">
          <p className="text-green-400">[INFO] Data upload completed successfully.</p>
          <p className="text-yellow-400">[WARNING] API rate limit reached (5/hr).</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LeftSidePanel;