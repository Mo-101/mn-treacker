import mapboxgl from 'mapbox-gl';

const addWeatherLayers = (map) => {
  const layers = [
    {
      id: 'precipitation',
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.8
    },
    {
      id: 'temperature',
      url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.7
    },
    {
      id: 'clouds',
      url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.6
    },
    {
      id: 'wind',
      url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
      maxzoom: 20,
      opacity: 0.7
    }
  ];
  
  layers.forEach(layer => {
    if (!map.getSource(layer.id)) {
      map.addSource(layer.id, {
        type: 'raster',
        tiles: [layer.url],
        tileSize: 256,
        maxzoom: layer.maxzoom
      });

      map.addLayer({
        id: layer.id,
        type: 'raster',
        source: layer.id,
        layout: { visibility: 'visible' },
        paint: { 'raster-opacity': layer.opacity }
      });
    }
  });
};

export const initializeLayers = (map) => {
  if (!map) return;

  map.on('load', () => {
    // Add weather layers
    addWeatherLayers(map);

    // Add detection heat map layer
    map.addSource('detections', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    map.addLayer({
      id: 'detection-heat',
      type: 'heatmap',
      source: 'detections',
      paint: {
        'heatmap-weight': 1,
        'heatmap-intensity': 1,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ],
        'heatmap-radius': 20,
        'heatmap-opacity': 0.7
      }
    });

    // Add prediction overlay layer
    map.addSource('predictions', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    map.addLayer({
      id: 'prediction-areas',
      type: 'fill',
      source: 'predictions',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'probability'],
          0, 'rgba(0,255,0,0.1)',
          0.5, 'rgba(255,255,0,0.2)',
          1, 'rgba(255,0,0,0.3)'
        ],
        'fill-outline-color': '#000'
      }
    });
  });
};

export const updateDetectionData = (map, data) => {
  if (map.getSource('detections')) {
    map.getSource('detections').setData(data);
  }
};

export const updatePredictionData = (map, data) => {
  if (map.getSource('predictions')) {
    map.getSource('predictions').setData(data);
  }
};

export const toggleLayer = (map, layerId, visible) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }
};

export const setLayerOpacity = (map, layerId, opacity) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
  }
};