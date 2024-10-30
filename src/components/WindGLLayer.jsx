import React, { useEffect, useRef, useState } from 'react';
import { useToast } from './ui/use-toast';
import { initWindGL, updateWindData } from '../utils/windGLUtils';

const WindGLLayer = ({ map }) => {
  const canvasRef = useRef(null);
  const windGLRef = useRef(null);
  const [currentHour, setCurrentHour] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!map || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      
      const gl = canvas.getContext('webgl', { antialiasing: false });
      if (!gl) {
        throw new Error('WebGL not supported');
      }

      windGLRef.current = initWindGL(gl);
      
      const resize = () => {
        canvas.width = map.getCanvas().width;
        canvas.height = map.getCanvas().height;
        windGLRef.current?.resize();
      };

      resize();
      map.on('resize', resize);

      // Initial wind data load
      updateWindData(windGLRef.current, currentHour);

      // Update wind data every 30 minutes
      const updateInterval = setInterval(() => {
        setCurrentHour((prev) => (prev + 6) % 48);
        updateWindData(windGLRef.current, currentHour);
      }, 30 * 60 * 1000);

      // Animation frame
      let animationFrame;
      const frame = () => {
        if (windGLRef.current?.windData) {
          windGLRef.current.draw();
        }
        animationFrame = requestAnimationFrame(frame);
      };
      frame();

      toast({
        title: "Wind Layer Initialized",
        description: "Wind particle visualization ready",
      });

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
  }, [map, currentHour]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

export default WindGLLayer;