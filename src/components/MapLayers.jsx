import mapboxgl from 'mapbox-gl';

export const addCustomLayers = (map) => {
  map.on('load', () => {
    addTemperatureLayer(map);
    addVegetationLayer(map);
    addPrecipitationLayer(map);
    addCloudsLayer(map);
    addRadarLayer(map);
  });
};

const addTemperatureLayer = (map) => {
  map.addSource('temperature-source', {
    type: 'raster',
    url: 'mapbox://mapbox.temperature-v2'
  });
  map.addLayer({
    id: 'temperature',
    type: 'raster',
    source: 'temperature-source',
    paint: {
      'raster-opacity': 0.7
    }
  });
};

const addVegetationLayer = (map) => {
  map.addSource('vegetation-source', {
    type: 'raster',
    url: 'mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m'
  });
  map.addLayer({
    id: 'vegetation',
    type: 'raster',
    source: 'vegetation-source',
    paint: {
      'raster-opacity': 0.7
    }
  });
};

const addPrecipitationLayer = (map) => {
  map.addSource('precipitation-source', {
    type: 'image',
    url: 'https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif',
    coordinates: [
      [-80.425, 46.437],
      [-71.516, 46.437],
      [-71.516, 37.936],
      [-80.425, 37.936]
    ]
  });
  map.addLayer({
    id: 'precipitation',
    type: 'raster',
    source: 'precipitation-source',
    paint: {
      'raster-opacity': 0.7
    }
  });
};

const addCloudsLayer = (map) => {
  map.addSource('clouds-source', {
    type: 'raster',
    url: 'mapbox://mapbox.satellite'  // This is a placeholder. Replace with actual cloud data source
  });
  map.addLayer({
    id: 'clouds',
    type: 'raster',
    source: 'clouds-source',
    paint: {
      'raster-opacity': 0.5
    }
  });
};

const addRadarLayer = (map) => {
  map.addSource('radar-source', {
    type: 'image',
    url: 'https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif',  // Replace with actual radar data
    coordinates: [
      [-80.425, 46.437],
      [-71.516, 46.437],
      [-71.516, 37.936],
      [-80.425, 37.936]
    ]
  });
  map.addLayer({
    id: 'radar',
    type: 'raster',
    source: 'radar-source',
    paint: {
      'raster-opacity': 0.7
    }
  });
};

export const addXweatherRadarAnimation = (map) => {
  const clientId = import.meta.env.VITE_XWEATHER_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_XWEATHER_CLIENT_SECRET;
  const wxLayer = 'radar';
  const frameCount = 5; // Reduced from 10 to 5 frames
  const intervalStep = 20; // Increased from 10 to 20 minutes
  let currentImageOffset = 0;

  const getPath = (server, offset) => {
    return `https://maps${server}.aerisapi.com/${clientId}_${clientSecret}/${wxLayer}/{z}/{x}/{y}/${(offset * intervalStep) * -1}min.png`;
  };

  const getTilePaths = (offset) => {
    return [
      getPath(1, offset),
      getPath(2, offset),
      getPath(3, offset),
      getPath(4, offset),
    ];
  };

  const addRasterLayer = (i) => {
    map.addSource(wxLayer + i, {
      "type": 'raster',
      "tiles": getTilePaths(i),
      "tileSize": 256,
      "attribution": "<a href='https://www.xweather.com/'>Xweather</a>"
    });

    map.addLayer({
      "id": wxLayer + i,
      "type": "raster",
      "source": wxLayer + i,
      "minzoom": 0,
      "maxzoom": 22,
      "paint": {
        'raster-opacity': 0
      }
    });
  };

  const setRasterLayerVisibility = (id, opacity) => {
    map.setPaintProperty(id, 'raster-opacity', opacity);
  };

  for (let i = 0; i < frameCount; i++) {
    addRasterLayer(i);
  }

  setRasterLayerVisibility(wxLayer + currentImageOffset, 1);

  setInterval(() => {
    setRasterLayerVisibility(wxLayer + currentImageOffset, 0);
    currentImageOffset = (currentImageOffset + 1) % frameCount;
    setRasterLayerVisibility(wxLayer + currentImageOffset, 1);
  }, 2000); // Update every 2 seconds
};

// Remove the addWindLayer function as it's not using Xweather API
