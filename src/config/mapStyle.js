import mapboxgl from 'mapbox-gl';

export const hybridMapStyle = {
    "version": 8,
    "name": "Enhanced 4K Hybrid Style",
    "pitch": 45,
    "light": {
        "intensity": 0.7,
        "color": "#ffffff",
        "anchor": "viewport",
        "position": [1.5, 90, 80],
        "atmosphereColor": "#ffffff",
        "atmosphereIntensity": 1.2
    },
    "sources": {
        "satellite": {
            "type": "raster",
            "tiles": [
                "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=" + mapboxgl.accessToken
            ],
            "tileSize": 512,
            "maxzoom": 22,
            "scheme": "xyz"
        },
        "terrain": {
            "type": "raster-dem",
            "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
            "tileSize": 512,
            "maxzoom": 14,
            "encoding": "mapbox"
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
                "raster-contrast": 0.1,
                "raster-brightness-min": 0.2,
                "raster-brightness-max": 1.1,
                "raster-saturation": 0.5,
                "raster-hue-rotate": 0,
                "raster-resampling": "linear"
            }
        },
        {
            "id": "hillshading",
            "type": "hillshade",
            "source": "terrain",
            "paint": {
                "hillshade-exaggeration": 0.7,
                "hillshade-illumination-direction": 335,
                "hillshade-shadow-color": "#000000",
                "hillshade-highlight-color": "#ffffff",
                "hillshade-accent-color": "#ffffff"
            }
        }
    ],
    "terrain": {
        "source": "terrain",
        "exaggeration": 3.0
    },
    "fog": {
        "range": [0.5, 10],
        "color": "#ffffff",
        "high-color": "#245cdf",
        "space-color": "#000000",
        "star-intensity": 0.15,
        "horizon-blend": 0.2
    }
};