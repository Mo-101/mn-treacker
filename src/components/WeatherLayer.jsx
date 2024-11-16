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

      // Special handling for wind particles
      if (layerType === 'wind') {
        // Add wind particle source if it doesn't exist
        if (!map.getSource('wind-particles')) {
          map.addSource('wind-particles', {
            type: 'raster',
            tiles: [`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
            tileSize: 256
          });
        }

        // Add wind particle layer
        map.addLayer({
          id: layerId,
          type: 'raster',
          source: 'wind-particles',
          paint: {
            'raster-opacity': opacity,
            'raster-fade-duration': 0,
            'raster-contrast': 0.6,
            'raster-saturation': 0.4,
            'raster-hue-rotate': 0
          }
        });

        toast({
          title: "Wind Layer Updated",
          description: "Wind particle layer has been loaded",
        });
        return;
      }

      // Handle other weather layers
      map.addSource(sourceId, {
        type: 'raster',
        tiles: [`https://tile.openweathermap.org/map/${layerType}_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
        tileSize: 256,
        attribution: '© OpenWeatherMap'
      });

      map.addLayer({
        id: layerId,
        type: 'raster',
        source: sourceId,
        paint: {
          'raster-opacity': opacity
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