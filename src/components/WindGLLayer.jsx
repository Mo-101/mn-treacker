import React, { useEffect, useRef, useState } from 'react';
import { useToast } from './ui/use-toast';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Settings2 } from 'lucide-react';

class WindGL {
  constructor(gl) {
    this.gl = gl;
    this.numParticles = 65536;
    this.fadeOpacity = 0.996;
    this.speedFactor = 0.25;
    this.dropRate = 0.003;
    this.dropRateBump = 0.01;
    this.particleSize = 1.0;
    this.windData = null;
    this.initShaders();
  }

  initShaders() {
    const gl = this.gl;
    // Initialize WebGL shaders and buffers here
    // This is a placeholder for the actual WebGL initialization
  }

  resize() {
    const gl = this.gl;
    const width = gl.canvas.width;
    const height = gl.canvas.height;
    gl.viewport(0, 0, width, height);
  }

  setWind(windData) {
    this.windData = windData;
  }

  draw() {
    if (!this.windData) return;
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Implement particle drawing logic here
  }

  updateSettings(settings) {
    Object.assign(this, settings);
    this.resize();
  }
}

const WindGLLayer = ({ map }) => {
  const canvasRef = useRef(null);
  const windGLRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [settings, setSettings] = useState({
    particleCount: 65536,
    speed: 25,
    opacity: 99,
    size: 1.0
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
        antialiasing: true,
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

      // Initial wind data fetch
      fetchWindData();

      // Update wind data every 10 minutes
      const updateInterval = setInterval(fetchWindData, 10 * 60 * 1000);

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

  const fetchWindData = async () => {
    try {
      const response = await fetch('/api/wind-data');
      if (!response.ok) throw new Error('Failed to fetch wind data');
      const data = await response.json();
      windGLRef.current?.setWind(data);
    } catch (error) {
      console.error('Error fetching wind data:', error);
    }
  };

  const updateWindSettings = (newSettings) => {
    setSettings(newSettings);
    if (windGLRef.current) {
      windGLRef.current.updateSettings({
        numParticles: newSettings.particleCount,
        speedFactor: newSettings.speed / 100,
        fadeOpacity: newSettings.opacity / 100,
        particleSize: newSettings.size
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
        <div className="absolute top-16 right-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg space-y-4 w-64">
          <div className="space-y-2">
            <label className="text-sm text-white">Particle Count</label>
            <Slider
              value={[settings.particleCount]}
              min={1000}
              max={65536}
              step={1000}
              onValueChange={([value]) => updateWindSettings({ ...settings, particleCount: value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white">Speed</label>
            <Slider
              value={[settings.speed]}
              min={1}
              max={100}
              onValueChange={([value]) => updateWindSettings({ ...settings, speed: value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white">Opacity</label>
            <Slider
              value={[settings.opacity]}
              min={1}
              max={100}
              onValueChange={([value]) => updateWindSettings({ ...settings, opacity: value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white">Particle Size</label>
            <Slider
              value={[settings.size]}
              min={0.1}
              max={3}
              step={0.1}
              onValueChange={([value]) => updateWindSettings({ ...settings, size: value })}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default WindGLLayer;