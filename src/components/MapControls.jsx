import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const MapControls = ({ activeLayer, onLayerChange }) => {
  return (
    <Card className="layer-controls fixed top-4 right-4 p-4 z-10">
      <div className="space-y-2">
        <Button
          variant={activeLayer === 'vegetation' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => onLayerChange('vegetation')}
        >
          Vegetation Layer
        </Button>
        <Button
          variant={activeLayer === 'temperature' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => onLayerChange('temperature')}
        >
          Temperature Layer
        </Button>
      </div>
    </Card>
  );
};

export default MapControls;