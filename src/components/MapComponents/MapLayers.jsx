import React from 'react';
import MapLegend from '../MapLegend';

const MapLayers = ({ layers, activeLayers, layerOpacity }) => {
  return (
    <>
      <MapLegend activeLayers={activeLayers} />
      {/* Additional layer controls can be added here */}
    </>
  );
};

export default MapLayers;