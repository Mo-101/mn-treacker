import React, { useEffect, useRef } from 'react';
import { useToast } from './ui/use-toast';
import { initWindGL } from '../utils/windGLUtils';

const WindGLLayer = ({ map }) => {
  const canvasRef = useRef(null);
  const windGLRef = useRef(null);
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

      // Start animation frame
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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

export default WindGLLayer;