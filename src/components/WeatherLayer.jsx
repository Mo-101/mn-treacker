import { useEffect } from 'react';
import { useToast } from './ui/use-toast';

const WeatherLayer = ({ map, layerType, visible, opacity }) => {
  const { toast } = useToast();
  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

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

      // Add new source and layer
      map.addSource(sourceId, {
        type: 'raster',
        tiles: [`https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
        tileSize: 512,
        attribution: '© OpenWeatherMap'
      });

      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        paint: {
          'raster-opacity': opacity,
          'raster-resampling': 'linear'
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
  }, [map, layerType, visible, opacity, OPENWEATHER_API_KEY]);

  return null;
};

export default WeatherLayer;