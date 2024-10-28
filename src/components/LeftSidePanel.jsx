import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Cloud, Thermometer, Sun, Wind, CloudRain, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useToast } from './ui/use-toast';

const LeftSidePanel = ({ isOpen, onClose, activeLayers, onLayerToggle, onOpacityChange, layers, selectAll, onSelectAllLayers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const weatherLayers = [
    { 
      id: 'precipitation', 
      name: 'Precipitation', 
      icon: CloudRain,
      description: 'Shows rainfall intensity and distribution',
      color: 'bg-blue-500'
    },
    { 
      id: 'temp', 
      name: 'Temperature', 
      icon: Thermometer,
      description: 'Displays temperature variations',
      color: 'bg-red-500'
    },
    { 
      id: 'clouds', 
      name: 'Cloud Cover', 
      icon: Cloud,
      description: 'Indicates cloud density and coverage',
      color: 'bg-gray-500'
    },
    { 
      id: 'wind', 
      name: 'Wind Speed', 
      icon: Wind,
      description: 'Shows wind speed and direction',
      color: 'bg-green-500'
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    toast({
      title: "Search",
      description: `Searching for: ${searchQuery}`,
    });
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full w-64 bg-[#1e293b] text-yellow-400 p-4 z-30 overflow-y-auto"
    >
      <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2">
        <X className="h-5 w-5" />
      </Button>
      <h2 className="text-xl font-bold mb-4">Weather Layers</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 bg-[#0f172a] border-gray-600 text-yellow-400"
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
            <Eye className="h-5 w-5" />
          </Button>
        </div>
      </form>
      <div className="space-y-4">
        <TooltipProvider>
          {weatherLayers.map((layer) => (
            <div key={layer.id} className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <layer.icon className={`mr-2 h-5 w-5 ${layer.color}`} />
                      {layer.name}
                    </span>
                    <Switch
                      checked={activeLayers.includes(layer.id)}
                      onCheckedChange={() => onLayerToggle(layer.id)}
                      disabled={selectAll}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{layer.description}</p>
                </TooltipContent>
              </Tooltip>
              <Slider
                defaultValue={[100]}
                max={100}
                step={1}
                className="w-full"
                onValueChange={(value) => onOpacityChange(layer.id, value[0])}
                disabled={!activeLayers.includes(layer.id) && !selectAll}
              />
            </div>
          ))}
        </TooltipProvider>
      </div>
      <Button
        onClick={onSelectAllLayers}
        className="mt-4 w-full bg-yellow-400 text-black hover:bg-yellow-500"
      >
        {selectAll ? 'Deselect All Layers' : 'Select All Layers'}
      </Button>

      <div className="mt-4 p-2 bg-[#0f172a] rounded-lg">
        <h3 className="font-semibold mb-2">Environmental Trends</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Temperature:</span>
            <span className="text-red-400">+2.5°C</span>
          </div>
          <div className="flex justify-between">
            <span>Habitat Moisture:</span>
            <span className="text-blue-400">-5%</span>
          </div>
          <div className="flex justify-between">
            <span>Vegetation:</span>
            <span className="text-green-400">+10%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-2 bg-[#0f172a] rounded-lg">
        <h3 className="font-semibold mb-2">Risk Summary</h3>
        <p className="text-sm text-red-400">Urban areas near water sources at highest risk</p>
      </div>
    </motion.div>
  );
};

export default LeftSidePanel;