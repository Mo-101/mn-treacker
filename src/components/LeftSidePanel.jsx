import React from 'react';
import { motion } from 'framer-motion';
import { X, Layers, Mountain } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { TooltipProvider } from './ui/tooltip';

const LeftSidePanel = ({ isOpen, onClose, activeLayers, onLayerToggle }) => {
  const baseLayers = [
    { 
      id: 'satellite', 
      name: 'Satellite', 
      icon: Layers,
      description: 'Satellite imagery',
      color: 'text-blue-500'
    },
    { 
      id: 'terrain', 
      name: 'Terrain', 
      icon: Mountain,
      description: 'Terrain elevation',
      color: 'text-green-500'
    }
  ];

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
      className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 z-30 overflow-y-auto shadow-2xl"
    >
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="absolute top-4 right-4 hover:bg-white/10 transition-colors"
      >
        <X className="h-5 w-5" />
      </Button>

      <h2 className="text-2xl font-bold mb-6">Map Layers</h2>

      <div className="space-y-4">
        <TooltipProvider>
          {baseLayers.map((layer) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="space-y-2">
                <div 
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 
                            transition-colors cursor-pointer group"
                  onClick={() => onLayerToggle(layer.id)}
                >
                  <span className="flex items-center gap-3">
                    <layer.icon className={`h-5 w-5 ${layer.color} transition-transform group-hover:scale-110`} />
                    <span className="font-medium">{layer.name}</span>
                  </span>
                  <Switch
                    checked={activeLayers.includes(layer.id)}
                    onCheckedChange={() => onLayerToggle(layer.id)}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default LeftSidePanel;