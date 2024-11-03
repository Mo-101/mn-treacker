import { weatherLayerConfigs } from './weatherLayerConfig';
import { toast } from '../components/ui/use-toast';

export class WeatherLayerManager {
  constructor(map, apiKey) {
    this.map = map;
    this.apiKey = apiKey;
    this.activeLayers = new Set();
  }

  async initializeLayers() {
    try {
      Object.values(weatherLayerConfigs).forEach(config => {
        this.addWeatherLayer(config);
      });

      toast({
        title: "Weather Layers Initialized",
        description: "Weather layers have been successfully loaded.",
      });
    } catch (error) {
      console.error('Error initializing weather layers:', error);
      toast({
        title: "Error",
        description: "Failed to initialize weather layers. Please try again.",
        variant: "destructive",
      });
    }
  }

  addWeatherLayer(config) {
    if (!this.map.getSource(config.id)) {
      this.map.addSource(config.id, {
        type: 'raster',
        tiles: [config.url(this.apiKey)],
        tileSize: 256,
        maxzoom: config.maxzoom
      });

      this.map.addLayer({
        id: config.id,
        type: 'raster',
        source: config.id,
        paint: {
          ...config.paint,
          'raster-height': config.height
        },
        layout: { visibility: 'visible' }
      });

      // Special handling for clouds layer
      if (config.id === 'clouds') {
        this.map.setLayerZoomRange(config.id, 0, 22);
      }
    }
  }

  toggleLayer(layerId, visible) {
    if (this.map.getLayer(layerId)) {
      this.map.setLayoutProperty(
        layerId,
        'visibility',
        visible ? 'visible' : 'none'
      );
      
      if (visible) {
        this.activeLayers.add(layerId);
      } else {
        this.activeLayers.delete(layerId);
      }
    }
  }

  setLayerOpacity(layerId, opacity) {
    if (this.map.getLayer(layerId)) {
      this.map.setPaintProperty(layerId, 'raster-opacity', opacity);
    }
  }

  updateLayerHeights(heightMultiplier = 1) {
    Object.values(weatherLayerConfigs).forEach(config => {
      if (this.map.getLayer(config.id)) {
        this.map.setPaintProperty(
          config.id,
          'raster-height',
          config.height * heightMultiplier
        );
      }
    });
  }
}