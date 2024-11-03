import React, { useState } from 'react';
import { WeatherLayerManager } from '../../utils/weatherLayerManager';
import TopNavigationBar from '../TopNavigationBar';
import SidePanels from '../SidePanels';
import MapContainer from './MapContainer';
import DataLayers from './DataLayers';
import { useToast } from '../ui/use-toast';

const WeatherMap = () => {
  const [mapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState(['precipitation', 'temperature', 'clouds', 'wind', 'cases', 'points']);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [map, setMap] = useState(null);
  const weatherLayerManager = React.useRef(null);

  const handleMapLoad = async (mapInstance) => {
    setMap(mapInstance);
    weatherLayerManager.current = new WeatherLayerManager(mapInstance);
    await weatherLayerManager.current.initializeLayers();
  };

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      const isActive = prev.includes(layerId);
      const newLayers = isActive
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId];
      
      if (map && map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          'visibility',
          isActive ? 'none' : 'visible'
        );
      }
      
      return newLayers;
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <MapContainer 
        mapState={mapState}
        onMapLoad={handleMapLoad}
      />
      
      {map && (
        <DataLayers 
          map={map}
          activeLayers={activeLayers}
        />
      )}
      
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
      />

      <SidePanels
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        setLeftPanelOpen={setLeftPanelOpen}
        setRightPanelOpen={setRightPanelOpen}
        activeLayers={activeLayers}
        handleLayerToggle={handleLayerToggle}
      />
    </div>
  );
};

export default WeatherMap;