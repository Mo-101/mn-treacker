export const hybridMapStyle = {
    "version": 8,
    "name": "Enhanced Hybrid Style",
    "pitch": 45,
    "light": {
        "intensity": 0.5,
        "color": "#fff",
        "anchor": "viewport",
        "position": [1.5, 90, 80]
    },
    "sources": {
        "satellite": {
            "type": "raster",
            "tiles": ["https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=" + mapboxgl.accessToken],
            "tileSize": 256,
            "maxzoom": 22
        },
        "terrain": {
            "type": "raster-dem",
            "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
            "tileSize": 512,
            "maxzoom": 14
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
            "source": "satellite",
            "paint": {
                "raster-opacity": 1,
                "raster-contrast": 0.2,
                "raster-brightness-min": 0.2,
                "raster-brightness-max": 1,
                "raster-saturation": 0.4,
                "raster-hue-rotate": 0
            }
        }
    ],
    "terrain": {
        "source": "terrain",
        "exaggeration": 1.5
    }
};