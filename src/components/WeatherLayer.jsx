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

      if (layerType === 'wind') {
        // Add wind raster array source
        map.addSource(sourceId, {
          type: 'raster-array',
          url: 'mapbox://rasterarrayexamples.gfs-winds',
          tileSize: 512
        });

        // Add wind particle layer
        map.addLayer({
          id: layerId,
          type: 'raster-particle',
          source: sourceId,
          'source-layer': '10winds',
          paint: {
            'raster-particle-speed-factor': 0.4,
            'raster-particle-fade-opacity-factor': 0.8,
            'raster-particle-reset-rate-factor': 0.4,
            'raster-particle-count': 2048,
            'raster-particle-max-speed': 70,
            'raster-particle-color': [
              'interpolate',
              ['linear'],
              ['raster-particle-speed'],
              1.5, ['rgb', 134, 163, 171],
              2.5, ['rgb', 134, 163, 171],
              4.63, ['rgb', 110, 143, 208],
              6.17, ['rgb', 15, 147, 167],
              7.72, ['rgb', 15, 147, 167],
              9.26, ['rgb', 57, 163, 57],
              10.29, ['rgb', 57, 163, 57],
              11.83, ['rgb', 194, 134, 62],
              13.37, ['rgb', 194, 134, 63],
              14.92, ['rgb', 200, 66, 13],
              16.46, ['rgb', 200, 66, 13],
              18.0, ['rgb', 210, 0, 50],
              20.06, ['rgb', 215, 0, 50],
              21.6, ['rgb', 175, 80, 136],
              23.66, ['rgb', 175, 80, 136],
              25.21, ['rgb', 117, 74, 147],
              27.78, ['rgb', 117, 74, 147],
              29.32, ['rgb', 68, 105, 141],
              31.89, ['rgb', 68, 105, 141],
              33.44, ['rgb', 194, 251, 119],
              42.18, ['rgb', 194, 251, 119],
              43.72, ['rgb', 241, 255, 109],
              48.87, ['rgb', 241, 255, 109],
              50.41, ['rgb', 255, 255, 255],
              57.61, ['rgb', 255, 255, 255],
              59.16, ['rgb', 255, 255, 255],
              68.93, ['rgb', 255, 255, 255],
              69.44, ['rgb', 255, 37, 255]
            ]
          }
        });

        toast({
          title: "Wind Layer Updated",
          description: "Wind particle visualization has been loaded",
        });
        return;
      }

      // Handle other weather layers
      const layerConfig = {
        precipitation: {
          tiles: [`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
          paint: { 'raster-opacity': opacity }
        },
        temp_new: {
          tiles: [`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
          paint: { 'raster-opacity': opacity }
        },
        clouds_new: {
          tiles: [`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
          paint: { 'raster-opacity': opacity }
        }
      };

      const config = layerConfig[layerType];
      if (!config) {
        console.error(`Unsupported layer type: ${layerType}`);
        return;
      }

      map.addSource(sourceId, {
        type: 'raster',
        tiles: config.tiles,
        tileSize: 256,
        attribution: '© OpenWeatherMap'
      });

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