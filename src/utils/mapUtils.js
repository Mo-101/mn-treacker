import mapboxgl from 'mapbox-gl';

export const addWeatherLayers = (map) => {
  const layers = ['temp', 'precipitation', 'clouds', 'wind'];
  const openWeatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  layers.forEach(layer => {
    if (!map.getSource(layer)) {
      map.addSource(layer, {
        type: 'raster',
        tiles: [
          `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${openWeatherApiKey}`
        ],
        tileSize: 256
      });

      map.addLayer({
        id: layer,
        type: 'raster',
        source: layer,
        layout: { visibility: 'none' },
        paint: { 'raster-opacity': 0.8 }
      });
    }
  });
};

export const toggleLayer = (map, layerId, visible) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
  }
};

export const updateMapState = (map, setMapState) => {
  const center = map.getCenter();
  setMapState({
    lng: center.lng.toFixed(4),
    lat: center.lat.toFixed(4),
    zoom: map.getZoom().toFixed(2)
  });
};