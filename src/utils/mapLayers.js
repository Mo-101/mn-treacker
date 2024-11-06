import mapboxgl from 'mapbox-gl';

const addWeatherLayers = (map) => {
  const layers = [
    {
      id: 'precipitation',
      sourceId: 'precipitation-data',
      url: 'mapbox://mapbox.precipitation',
      maxzoom: 20,
      opacity: 0.8,
      colorRange: [0, 100], // mm/hour
      colorScale: [
        'interpolate',
        ['linear'],
        ['raster-value'],
        0, 'rgba(0,0,255,0)',
        25, 'rgba(0,255,255,0.5)',
        50, 'rgba(0,255,0,0.7)',
        75, 'rgba(255,255,0,0.8)',
        100, 'rgba(255,0,0,1)'
      ]
    },
    {
      id: 'temperature',
      sourceId: 'temperature-data',
      url: 'mapbox://mapbox.temperature',
      maxzoom: 20,
      opacity: 0.7,
      colorRange: [-20, 40], // Celsius
      colorScale: [
        'interpolate',
        ['linear'],
        ['raster-value'],
        -20, '#0000FF',
        0, '#00FFFF',
        20, '#FFFF00',
        40, '#FF0000'
      ]
    }
  ];
  
  layers.forEach(layer => {
    if (!map.getSource(layer.sourceId)) {
      map.addSource(layer.sourceId, {
        type: 'raster-array',
        url: layer.url,
        tileSize: 256,
        maxzoom: layer.maxzoom
      });

      map.addLayer({
        id: layer.id,
        type: 'raster',
        source: layer.sourceId,
        slot: 'top',
        layout: { visibility: 'visible' },
        paint: { 
          'raster-opacity': layer.opacity,
          'raster-color-range': layer.colorRange,
          'raster-color': layer.colorScale,
          'raster-resampling': 'linear',
          'raster-fade-duration': 0
        }
      });
    }
  });
};

export const initializeLayers = (map) => {
  if (!map) return;

  map.on('load', () => {
    addWeatherLayers(map);
  });
};

export const updateLayerOpacity = (map, layerId, opacity) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
  }
};

export const updateColorRange = (map, layerId, range) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-color-range', range);
  }
};