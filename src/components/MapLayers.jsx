import { weatherLayers } from '../utils/weatherLayerConfig';
import { toast } from './ui/use-toast';

export const addCustomLayers = async (map) => {
  try {
    weatherLayers.forEach(layer => {
      if (!map.getSource(layer.id)) {
        map.addSource(layer.id, {
          type: 'raster',
          tiles: [layer.url],
          tileSize: 256
        });

        map.addLayer({
          id: layer.id,
          type: 'raster',
          source: layer.id,
          layout: { visibility: 'none' },
          paint: { 
            'raster-opacity': layer.opacity,
            'raster-opacity-transition': {
              duration: 300
            }
          }
        });
      }
    });

    toast({
      title: "Success",
      description: "Weather layers loaded successfully",
    });
  } catch (error) {
    console.error('Error loading weather layers:', error);
    toast({
      title: "Error",
      description: "Failed to load weather layers",
      variant: "destructive",
    });
  }
};

export const toggleWeatherLayer = (map, layerId, isVisible) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(
      layerId,
      'visibility',
      isVisible ? 'visible' : 'none'
    );
    return true;
  }
  return false;
};

export const updateLayerOpacity = (map, layerId, opacity) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
    return true;
  }
  return false;
};