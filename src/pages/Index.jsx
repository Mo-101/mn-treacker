import { useState, useEffect, useRef } from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = "pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g";

const STYLES = {
  vegetation: "mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m",
  temperature: "mapbox://styles/akanimo1/cld5h233p000q01qat06k4qw7",
  wind: "mapbox://styles/mapbox/dark-v10"
};

const Index = () => {
  const [activeLayer, setActiveLayer] = useState("vegetation");
  const { toast } = useToast();
  const mapRef = useRef();
  const windLayerInitialized = useRef(false);

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
    
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      
      // Handle wind layer visibility
      if (map.getLayer('wind-layer')) {
        map.setLayoutProperty('wind-layer', 'visibility', 
          layer === 'wind' ? 'visible' : 'none'
        );
      }
    }

    toast({
      title: "Layer Changed",
      description: `Switched to ${layer} layer`,
      duration: 2000,
    });
  };

  useEffect(() => {
    if (!mapRef.current || windLayerInitialized.current) return;
    
    const map = mapRef.current.getMap();
    
    map.on('style.load', () => {
      if (!windLayerInitialized.current) {
        addWindLayer(map);
        windLayerInitialized.current = true;
      }
    });

    return () => {
      windLayerInitialized.current = false;
    };
  }, []);

  const addWindLayer = (map) => {
    try {
      if (!map.getSource('raster-array-source')) {
        map.addSource('raster-array-source', {
          type: 'raster-array',
          url: 'mapbox://rasterarrayexamples.gfs-winds',
          tileSize: 512
        });
      }

      if (!map.getLayer('wind-layer')) {
        map.addLayer({
          id: 'wind-layer',
          type: 'raster-particle',
          source: 'raster-array-source',
          'source-layer': '10winds',
          layout: {
            visibility: activeLayer === 'wind' ? 'visible' : 'none'
          },
          paint: {
            'raster-particle-speed-factor': 0.4,
            'raster-particle-fade-opacity-factor': 0.9,
            'raster-particle-reset-rate-factor': 0.4,
            'raster-particle-count': 4000,
            'raster-particle-max-speed': 40,
            'raster-particle-color': [
              'interpolate',
              ['linear'],
              ['raster-particle-speed'],
              1.5, 'rgba(134,163,171,256)',
              2.5, 'rgba(126,152,188,256)',
              4.12, 'rgba(110,143,208,256)',
              4.63, 'rgba(110,143,208,256)',
              6.17, 'rgba(15,147,167,256)',
              7.72, 'rgba(15,147,167,256)',
              9.26, 'rgba(57,163,57,256)',
              10.29, 'rgba(57,163,57,256)',
              11.83, 'rgba(194,134,62,256)',
              13.37, 'rgba(194,134,63,256)',
              14.92, 'rgba(200,66,13,256)',
              16.46, 'rgba(200,66,13,256)',
              18.0, 'rgba(210,0,50,256)',
              20.06, 'rgba(215,0,50,256)',
              21.6, 'rgba(175,80,136,256)',
              23.66, 'rgba(175,80,136,256)',
              25.21, 'rgba(117,74,147,256)',
              27.78, 'rgba(117,74,147,256)',
              29.32, 'rgba(68,105,141,256)',
              31.89, 'rgba(68,105,141,256)',
              33.44, 'rgba(194,251,119,256)',
              42.18, 'rgba(194,251,119,256)',
              43.72, 'rgba(241,255,109,256)',
              48.87, 'rgba(241,255,109,256)',
              50.41, 'rgba(256,256,256,256)',
              57.61, 'rgba(256,256,256,256)',
              59.16, 'rgba(0,256,256,256)',
              68.93, 'rgba(0,256,256,256)',
              69.44, 'rgba(256,37,256,256)'
            ]
          }
        });

        toast({
          title: "Wind Layer Initialized",
          description: "Wind particle layer is ready",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error adding wind layer:', error);
      toast({
        title: "Error",
        description: "Failed to initialize wind layer",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 8,
          latitude: 10,
          zoom: 5,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={STYLES[activeLayer]}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="bottom-right" />
      </Map>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg z-10 space-y-2"
      >
        <Button
          variant={activeLayer === "vegetation" ? "default" : "outline"}
          className="w-full transition-all duration-300"
          onClick={() => handleLayerChange("vegetation")}
        >
          Vegetation Layer
        </Button>
        <Button
          variant={activeLayer === "temperature" ? "default" : "outline"}
          className="w-full transition-all duration-300"
          onClick={() => handleLayerChange("temperature")}
        >
          Temperature Layer
        </Button>
        <Button
          variant={activeLayer === "wind" ? "default" : "outline"}
          className="w-full transition-all duration-300"
          onClick={() => handleLayerChange("wind")}
        >
          Wind Layer
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;