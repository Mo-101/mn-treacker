import React from 'react';
import { Button } from './ui/button';

const MapLayerToggle = ({ showDefaultStyle, toggleDefaultStyle }) => {
  return (
    <Button onClick={toggleDefaultStyle} className="mt-2">
      {showDefaultStyle ? 'Hide Default Style' : 'Show Default Style'}
    </Button>
  );
};

export default MapLayerToggle;