export const customMapStyle = {
  version: 8,
  name: "Custom Hybrid Style",
  sources: {
    "mapbox-streets": {
      type: "vector",
      url: "mapbox://mapbox.mapbox-streets-v8"
    },
    "mapbox-satellite": {
      type: "raster",
      url: "mapbox://mapbox.satellite",
      tileSize: 256
    },
    "mapbox-terrain": {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14
    }
  },
  layers: [
    {
      id: "satellite",
      type: "raster",
      source: "mapbox-satellite",
      paint: {
        "raster-saturation": 0.2,
        "raster-contrast": 0.1,
        "raster-brightness-min": 0.2
      }
    },
    {
      id: "terrain-rgb",
      type: "hillshade",
      source: "mapbox-terrain",
      paint: {
        "hillshade-exaggeration": 0.6
      }
    }
  ],
  terrain: {
    source: "mapbox-terrain",
    exaggeration: 1.5
  }
};