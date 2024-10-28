import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from "./ui/use-toast";

const MastomysTracker = ({ map }) => {
  const [ratLocations, setRatLocations] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRatLocations = async () => {
      try {
        // Use mock data if in development or if API is not available
        if (import.meta.env.DEV || !import.meta.env.VITE_API_URL) {
          const mockData = {
            features: [
              {
                geometry: {
                  coordinates: [3.3792, 6.5244], // Lagos coordinates
                  type: "Point"
                },
                properties: {
                  timestamp: new Date().toISOString(),
                  confidence: 0.95
                }
              }
            ]
          };
          setRatLocations(mockData.features);
          return;
        }

        const response = await fetch('/api/rat-locations');
        if (!response.ok) {
          throw new Error('Failed to fetch rat locations');
        }
        const data = await response.json();
        setRatLocations(data.features);
      } catch (error) {
        console.error('Error fetching rat locations:', error);
        toast({
          title: "Warning",
          description: "Using sample data - couldn't fetch real rat locations",
          variant: "warning",
        });
      }
    };

    fetchRatLocations();
  }, [toast]);

  useEffect(() => {
    if (!map || !ratLocations.length) return;

    // Add glowing effect styles
    const pulsingDot = {
      width: 100,
      height: 100,
      data: new Uint8Array(100 * 100 * 4),

      onAdd: function() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      render: function() {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (this.width / 2) * 0.3;
        const outerRadius = (this.width / 2) * 0.7 * t + radius;
        const context = this.context;

        context.clearRect(0, 0, this.width, this.height);

        // Draw the outer circle
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(180, 34, 34, ${1 - t})`;
        context.fill();

        // Draw the core circle
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(180, 34, 34, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 * (1 - t);
        context.fill();
        context.stroke();

        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        map.triggerRepaint();
        return true;
      }
    };

    // Add the custom image
    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

    // Add rat locations to the map
    if (!map.getSource('rat-locations')) {
      map.addSource('rat-locations', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: ratLocations
        }
      });

      // Add a layer for the glowing dots
      map.addLayer({
        id: 'rat-points-glow',
        type: 'symbol',
        source: 'rat-locations',
        layout: {
          'icon-image': 'pulsing-dot',
          'icon-allow-overlap': true
        }
      });
    } else {
      // Update existing source
      map.getSource('rat-locations').setData({
        type: 'FeatureCollection',
        features: ratLocations
      });
    }

    return () => {
      if (map.getLayer('rat-points-glow')) map.removeLayer('rat-points-glow');
      if (map.getSource('rat-locations')) map.removeSource('rat-locations');
      if (map.hasImage('pulsing-dot')) map.removeImage('pulsing-dot');
    };
  }, [map, ratLocations]);

  return null;
};

export default MastomysTracker;