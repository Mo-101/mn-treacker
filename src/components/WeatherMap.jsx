import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMastomysLocations, fetchLassaFeverCases, fetchWeatherLayers } from '../utils/api';
import MapContainer from './MapComponents/MapContainer';
import MapControls from './MapComponents/MapControls';
import MapLayers from './MapComponents/MapLayers';
import { useToast } from './ui/use-toast';

const WeatherMap = () => {
  const [activeLayers, setActiveLayers] = useState(['precipitation', 'temperature', 'clouds', 'wind']);
  const [layerOpacity, setLayerOpacity] = useState(80);
  const { toast } = useToast();

  const { data: ratLocations, isError: ratError } = useQuery({
    queryKey: ['ratLocations'],
    queryFn: fetchMastomysLocations,
    staleTime: 300000,
    retry: 2,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch rat location data",
        variant: "destructive",
      });
    }
  });

  const { data: lassaCases, isError: lassaError } = useQuery({
    queryKey: ['lassaCases'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000,
    retry: 2,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch Lassa fever cases",
        variant: "destructive",
      });
    }
  });

  const { data: weatherLayers, isError: weatherError } = useQuery({
    queryKey: ['weatherLayers'],
    queryFn: fetchWeatherLayers,
    staleTime: 300000,
    retry: 2,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch weather layers",
        variant: "destructive",
      });
    }
  });

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <MapContainer
        ratLocations={ratLocations}
        lassaCases={lassaCases}
        activeLayers={activeLayers}
        layerOpacity={layerOpacity}
      />
      
      <MapControls
        activeLayers={activeLayers}
        onLayerToggle={handleLayerToggle}
        layerOpacity={layerOpacity}
        onOpacityChange={handleOpacityChange}
      />

      <MapLayers
        layers={weatherLayers}
        activeLayers={activeLayers}
        layerOpacity={layerOpacity}
      />
    </div>
  );
};

export default WeatherMap;