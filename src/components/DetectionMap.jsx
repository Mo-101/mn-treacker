import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import { hybridMapStyle } from '../config/mapStyle';

const DetectionMap = ({ detections = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: hybridMapStyle,
        center: [0, 0],
        zoom: 2,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        detections.forEach((detection) => {
          new mapboxgl.Marker()
            .setLngLat(detection.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">Detection #${detection.id}</h3>
                  <p>Confidence: ${detection.confidence}%</p>
                  <p>Time: ${detection.timestamp}</p>
                </div>
              `)
            )
            .addTo(map.current);
        });
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your configuration.",
        variant: "destructive",
      });
    }

    return () => map.current?.remove();
  }, []);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default DetectionMap;