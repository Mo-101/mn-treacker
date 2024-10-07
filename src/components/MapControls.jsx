import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const MapControls = ({ activeLayer, onLayerChange, onSearch }) => {
  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg flex flex-col space-y-2">
      <Button 
        onClick={() => onLayerChange('temperature')}
        variant={activeLayer === 'temperature' ? 'default' : 'outline'}
        className="w-full"
      >
        Temperature
      </Button>
      <Button 
        onClick={() => onLayerChange('wind')}
        variant={activeLayer === 'wind' ? 'default' : 'outline'}
        className="w-full"
      >
        Wind
      </Button>
      <Button 
        onClick={() => onLayerChange('precipitation')}
        variant={activeLayer === 'precipitation' ? 'default' : 'outline'}
        className="w-full"
      >
        Precipitation
      </Button>
      <div className="flex space-x-2 mt-4">
        <Input placeholder="Search for rat sightings..." />
        <Button onClick={onSearch}>Search</Button>
      </div>
    </div>
  );
};

export default MapControls;