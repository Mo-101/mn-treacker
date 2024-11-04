export const hybridMapStyle = {
    "version": 8,
    "name": "Enhanced Hybrid Style",
    "pitch": 0,
    "light": {
        "intensity": 0.35,
        "color": "#fff",
        "anchor": "viewport",
        "position": [1.5, 90, 80]
    },
    "sources": {
        "GoogleSatellite_0": {
            "type": "raster",
            "tiles": ["https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"],
            "tileSize": 256,
            "maxzoom": 20,
            "attribution": "Imagery © Google"
        },
        "GoogleHybrid_1": {
            "type": "raster",
            "tiles": ["https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"],
            "tileSize": 256,
            "maxzoom": 20,
            "attribution": "Imagery © Google"
        }
    },
    "sprite": "mapbox://sprites/mapbox/satellite-streets-v12",
    "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "#000000"
            }
        },
        {
            "id": "satellite",
            "type": "raster",
            "source": "GoogleSatellite_0",
            "paint": {
                "raster-opacity": 1,
                "raster-contrast": 0.1,
                "raster-brightness-min": 0.2,
                "raster-brightness-max": 1,
                "raster-saturation": 0.2,
                "raster-hue-rotate": 0
            }
        },
        {
            "id": "hybrid",
            "type": "raster",
            "source": "GoogleHybrid_1",
            "paint": {
                "raster-opacity": 0.9,
                "raster-contrast": 0.2,
                "raster-brightness-min": 0.1,
                "raster-brightness-max": 1,
                "raster-saturation": 0.3
            }
        }
    ]
};