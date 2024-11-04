import React, { useEffect, useRef, useState } from 'react';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Settings2 } from 'lucide-react';
import { WindGL } from '../utils/windGL';
import { fetchWindData, loadWindImage } from '../utils/windDataFetcher';
import WindControls from './WindControls';

const WindGLLayer = ({ map }) => {
  const canvasRef = useRef(null);
  const windGLRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [settings, setSettings] = useState({
    particleCount: 65536,
    opacity: 99.6,
    speed: 25,
    dropRate: 0.3,
    dropRateBump: 1.0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!map || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      
      const gl = canvas.getContext('webgl', { 
        antialiasing: false,
        alpha: true,
        premultipliedAlpha: false
      });

      if (!gl) {
        throw new Error('WebGL not supported');
      }

      windGLRef.current = new WindGL(gl);
      
      const resize = () => {
        canvas.width = map.getCanvas().width;
        canvas.height = map.getCanvas().height;
        windGLRef.current?.resize();
      };

      resize();
      map.on('resize', resize);

      const updateWind = async () => {
        const data = await fetchWindData(Date.now());
        if (data) {
          const windData = await loadWindImage(data, Date.now());
          windGLRef.current?.setWind(windData);
        }
      };

      // Initial wind data fetch
      updateWind();

      // Update wind data every 10 minutes
      const updateInterval = setInterval(updateWind, 10 * 60 * 1000);

      // Animation frame
      let animationFrame;
      const frame = () => {
        if (windGLRef.current?.windData) {
          windGLRef.current.draw();
        }
        animationFrame = requestAnimationFrame(frame);
      };
      frame();

      return () => {
        cancelAnimationFrame(animationFrame);
        clearInterval(updateInterval);
        map.off('resize', resize);
      };
    } catch (error) {
      console.error('Error initializing wind layer:', error);
      toast({
        title: "Error",
        description: "Failed to initialize wind visualization",
        variant: "destructive",
      });
    }
  }, [map]);

  const updateWindSettings = (newSettings) => {
    setSettings(newSettings);
    if (windGLRef.current) {
      windGLRef.current.updateSettings({
        numParticles: newSettings.particleCount,
        fadeOpacity: newSettings.opacity,
        speedFactor: newSettings.speed,
        dropRate: newSettings.dropRate,
        dropRateBump: newSettings.dropRateBump
      });
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm"
        onClick={() => setShowControls(!showControls)}
      >
        <Settings2 className="h-4 w-4" />
      </Button>

      {showControls && (
        <div className="absolute top-16 right-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
          <WindControls 
            settings={settings}
            onSettingsChange={updateWindSettings}
          />
        </div>
      )}
    </>
  );
};

export default WindGLLayer;