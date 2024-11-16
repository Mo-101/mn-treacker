import { useEffect } from 'react';
import { useToast } from './ui/use-toast';
import mapboxgl from 'mapbox-gl';

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

      // Configure layer based on type
      const layerConfig = {
        wind: {
          tiles: [`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
          paint: {
            'raster-opacity': opacity,
            'raster-fade-duration': 0,
            'raster-brightness-min': 0.2,
            'raster-brightness-max': 1
          }
        },
        precipitation: {
          tiles: [`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
          paint: {
            'raster-opacity': opacity
          }
        },
        temp_new: {
          tiles: [`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
          paint: {
            'raster-opacity': opacity
          }
        },
        clouds_new: {
          tiles: [`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
          paint: {
            'raster-opacity': opacity
          }
        }
      };

      const config = layerConfig[layerType];
      if (!config) {
        console.error(`Unsupported layer type: ${layerType}`);
        return;
      }

      // Add source
      map.addSource(sourceId, {
        type: 'raster',
        tiles: config.tiles,
        tileSize: 256,
        attribution: '© OpenWeatherMap'
      });

      // Add layer
      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        paint: config.paint
      });

      toast({
        title: `${layerType.charAt(0).toUpperCase() + layerType.slice(1)} Layer Updated`,
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

    // Cleanup function
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