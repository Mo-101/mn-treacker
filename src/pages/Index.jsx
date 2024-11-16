import { useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g";

const STYLES = {
  vegetation: "mapbox://styles/akanimo1/cm10t9lw001cs01pbc93la79m",
  temperature: "mapbox://styles/akanimo1/cld5h233p000q01qat06k4qw7"
};

const Index = () => {
  const [activeLayer, setActiveLayer] = useState("vegetation");
  const { toast } = useToast();

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
    toast({
      title: "Layer Changed",
      description: `Switched to ${layer} layer`,
      duration: 2000,
    });
  };

  return (
    <div className="relative w-screen h-screen">
      <Map
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
      </motion.div>
    </div>
  );
};

export default Index;