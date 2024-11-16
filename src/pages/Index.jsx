import React, { useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapControls from '../components/MapControls';
import { useToast } from '../components/ui/use-toast';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const STYLES = {
  vegetation: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m',
  temperature: 'mapbox://styles/akanimo1/cld5h233p000q01qat06k4qw7'
};

const Index = () => {
  const [activeLayer, setActiveLayer] = useState('vegetation');
  const { toast } = useToast();

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
    toast({
      title: "Layer Changed",
      description: `Switched to ${layer} layer`,
      duration: 2000,
    });
  };

  return (
    <div className="relative w-screen h-screen">
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={STYLES[activeLayer]}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="bottom-right" />
      </Map>
      <MapControls activeLayer={activeLayer} onLayerChange={handleLayerChange} />
    </div>
  );
};

export default Index;