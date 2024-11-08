import { weatherLayers } from './weatherLayerConfig';
import { toast } from '../components/ui/use-toast';

export const addWeatherLayer = (map, layerId) => {
  const layer = weatherLayers.find(l => l.id === layerId);
  if (!layer || !map) return false;

  try {
    // Remove existing layer and source if they exist
    if (map.getSource(layerId)) {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      map.removeSource(layerId);
    }

    // Add new source
    map.addSource(layerId, {
      type: 'raster',
      tiles: [layer.url],
      tileSize: 256,
      attribution: '© OpenWeatherMap'
    });

    // Add new layer
    map.addLayer({
      id: layerId,
      type: 'raster',
      source: layerId,
      paint: {
        'raster-opacity': layer.opacity,
        'raster-opacity-transition': { duration: 300 }
      },
      layout: { visibility: 'none' }
    });

    return true;
  } catch (error) {
    console.error(`Error adding ${layerId} layer:`, error);
    toast({
      title: "Error",
      description: `Failed to add ${layer.name} layer`,
      variant: "destructive",
    });
    return false;
  }
};

export const toggleWeatherLayer = (map, layerId, isVisible) => {
  if (!map || !map.getLayer(layerId)) {
    if (isVisible) {
      return addWeatherLayer(map, layerId);
    }
    return true;
  }

  try {
    map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
    return true;
  } catch (error) {
    console.error(`Error toggling ${layerId} layer:`, error);
    return false;
  }
};

export const updateLayerOpacity = (map, layerId, opacity) => {
  if (!map || !map.getLayer(layerId)) return false;
  
  try {
    map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
    return true;
  } catch (error) {
    console.error(`Error updating ${layerId} opacity:`, error);
    return false;
  }
};