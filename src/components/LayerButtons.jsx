import React from 'react';
import { Button } from './ui/button';

const LayerButtons = () => {
  const layers = ['Temperature', 'Wind', 'Precipitation'];

  return (
    <div className="flex space-x-2">
      {layers.map((layer) => (
        <Button
          key={layer}
          variant="ghost"
          className="text-white hover:bg-white hover:bg-opacity-20 focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
        >
          {layer}
        </Button>
      ))}
    </div>
  );
};

export default LayerButtons;