import React from 'react';
import { Switch } from '../../../components/ui/switch';
import { Slider } from '../../../components/ui/slider';
import { Button } from '../../../components/ui/button';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const LayerToggle = ({
  layers,
  activeLayers,
  onLayerToggle,
  onReset,
  windOpacity,
  onWindOpacityChange
}) => {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-20 bg-black/70 backdrop-blur-md p-6 rounded-r-lg text-white w-80"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Map Layers</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="hover:bg-white/10"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        {layers.map((layer) => (
          <motion.div
            key={layer.id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              {<layer.icon className="h-5 w-5" />}
              <span>{layer.name}</span>
            </div>
            <Switch
              checked={activeLayers.includes(layer.id)}
              onCheckedChange={() => onLayerToggle(layer.id)}
            />
          </motion.div>
        ))}

        {activeLayers.includes('wind') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4"
          >
            <label className="text-sm text-gray-300 mb-2 block">
              Wind Layer Opacity
            </label>
            <Slider
              value={[windOpacity * 100]}
              onValueChange={(value) => onWindOpacityChange(value[0] / 100)}
              min={10}
              max={100}
              step={1}
              className="w-full"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LayerToggle;