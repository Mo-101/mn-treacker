import mapboxgl from 'mapbox-gl';

export const initializeMap = (mapContainer, map, mapState, setMapState, addCustomLayers, updateMapState, toast) => {
  try {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      pitch: 45,
      bearing: 0,
      antialias: true,
      maxZoom: 22,
      minZoom: 0,
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN
    });

    map.current.on('load', () => {
      map.current.addControl(new mapboxgl.NavigationControl());
      
      // Add terrain data source
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      
      // Add 3D terrain
      map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // Add custom layers after map is loaded
      addCustomLayers(map.current);
      updateMapState();
    });

    map.current.on('move', updateMapState);

  } catch (error) {
    console.error('Error initializing map:', error);
    toast({
      title: "Error",
      description: "Failed to initialize map. Please try again later.",
      variant: "destructive",
    });
  }
};

export const toggleLayer = (map, layerId, visible) => {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
    console.log(`Layer ${layerId} visibility set to ${visible ? 'visible' : 'none'}`);
  }
};

export const setLayerOpacity = (map, layerId, opacity) => {
  if (map.getLayer(layerId)) {
    map.setPaintProperty(layerId, 'raster-opacity', opacity / 100);
    console.log(`Layer ${layerId} opacity set to ${opacity}%`);
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
