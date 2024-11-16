import React from 'react';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { CloudRain, Thermometer, Cloud, Wind } from 'lucide-react';

const LayerControls = ({ layers, activeLayers, setActiveLayers, layerOpacity, setLayerOpacity, onLayerToggle, onOpacityChange }) => {
  const { toast } = useToast();

  const handleLayerToggle = async (layerId) => {
    try {
      const isEnabled = !activeLayers.includes(layerId);
      const result = await onLayerToggle(layerId, isEnabled);
      
      if (result.success) {
        setActiveLayers(prev => 
          isEnabled ? [...prev, layerId] : prev.filter(id => id !== layerId)
        );
        
        toast({
          title: `${layerId.charAt(0).toUpperCase() + layerId.slice(1)} Layer`,
          description: isEnabled ? "Layer enabled" : "Layer disabled",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to toggle ${layerId} layer`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Failed to toggle ${layerId} layer:`, error);
      toast({
        title: "Error",
        description: "Failed to toggle layer",
        variant: "destructive",
      });
    }
  };

  const handleOpacityChange = async (opacity) => {
    setLayerOpacity(opacity);
    for (const layerId of activeLayers) {
      try {
        const result = await onOpacityChange(layerId, opacity / 100);
        if (!result.success) {
          toast({
            title: "Error",
            description: `Failed to set opacity for ${layerId} layer`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(`Failed to set opacity for ${layerId} layer:`, error);
      }
    }
  };

  const getLayerIcon = (layerId) => {
    switch (layerId) {
      case 'precipitation':
        return <CloudRain className="h-5 w-5" />;
      case 'temperature':
        return <Thermometer className="h-5 w-5" />;
      case 'clouds':
        return <Cloud className="h-5 w-5" />;
      case 'wind':
        return <Wind className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900/90 backdrop-blur-md rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {layers.map((layer) => (
          <div key={layer.id} className="bg-black/40 p-3 rounded-lg border border-gray-800">
            <div className="flex flex-col space-y-2">
              <Button
                variant={activeLayers.includes(layer.id) ? "default" : "secondary"}
                onClick={() => handleLayerToggle(layer.id)}
                className={`w-full justify-start gap-2 transition-all duration-200 ${
                  activeLayers.includes(layer.id) 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {getLayerIcon(layer.id)}
                <span className="font-medium">{layer.name}</span>
              </Button>
              
              {activeLayers.includes(layer.id) && (
                <div className="mt-2 px-1">
                  <label className="text-sm text-gray-400 mb-1 block">Opacity</label>
                  <Slider
                    value={[layerOpacity]}
                    onValueChange={(value) => handleOpacityChange(value[0])}
                    max={100}
                    step={1}
                    className="slider-yellow"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerControls;