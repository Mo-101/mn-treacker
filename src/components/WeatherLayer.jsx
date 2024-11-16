import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from './ui/use-toast';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const WeatherLayer = ({ map, layerType, visible, opacity }) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!map || !OPENWEATHER_API_KEY) {
      if (!OPENWEATHER_API_KEY) {
        toast({
          title: "Configuration Error",
          description: "OpenWeather API key is missing",
          variant: "destructive",
        });
      }
      return;
    }

    const layerId = `${layerType}-layer`;
    const sourceId = `${layerType}-source`;

    try {
      // Remove existing layer and source if they exist
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      if (!visible) return;

      const layerConfig = getLayerConfig(layerType);
      
      map.addSource(sourceId, {
        type: 'raster',
        tiles: [layerConfig.tileUrl],
        tileSize: 256,
        attribution: '© OpenWeatherMap'
      });

      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        paint: {
          'raster-opacity': opacity,
          ...layerConfig.paint
        }
      });

      toast({
        title: "Weather Layer Updated",
        description: `${layerType} layer has been loaded`,
      });

    } catch (error) {
      console.error(`Error setting up ${layerType} layer:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${layerType} layer`,
        variant: "destructive",
      });
    }

    return () => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, layerType, visible, opacity]);

  return null;
};

const getLayerConfig = (layerType) => {
  const configs = {
    temperature: {
      tileUrl: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      paint: {
        'raster-opacity': 0.8
      }
    },
    precipitation: {
      tileUrl: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      paint: {
        'raster-opacity': 0.7
      }
    },
    wind: {
      tileUrl: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      paint: {
        'raster-opacity': 0.6
      }
    },
    clouds: {
      tileUrl: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
      paint: {
        'raster-opacity': 0.5
      }
    }
  };

  return configs[layerType] || configs.temperature;
};

export default WeatherLayer;