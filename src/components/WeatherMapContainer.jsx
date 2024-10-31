import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from './ui/use-toast';
import DetectionSpotLayer from './DetectionSpotLayer';
import LassaFeverCasesLayer from './LassaFeverCasesLayer';
import { addCustomLayers } from '../utils/mapLayers';
import { hybridMapStyle } from '../config/mapStyle';

export const WeatherMapContainer = ({ mapState, activeLayers, layerOpacity, detections }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      toast({
        title: "Configuration Error",
        description: "Mapbox token is missing. Please check your environment variables.",
        variant: "destructive",
      });
      return;
    }

    if (map.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: hybridMapStyle,
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 0,
        antialias: true,
        maxZoom: 20,
        preserveDrawingBuffer: true
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', async () => {
        // Add terrain source
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });

        // Add 3D terrain
        map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // Add atmospheric sky layer
        map.current.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });

        await addCustomLayers(map.current);
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
  }, [mapState.lat, mapState.lng, mapState.zoom, toast]);

  useEffect(() => {
    if (!map.current) return;
    
    activeLayers.forEach(layerId => {
      if (map.current.getLayer(layerId)) {
        map.current.setPaintProperty(layerId, 'raster-opacity', layerOpacity / 100);
      }
    });
  }, [activeLayers, layerOpacity]);

  return (
    <div ref={mapContainer} className="absolute inset-0">
      {map.current && (
        <>
          <DetectionSpotLayer map={map.current} detections={detections} />
          <LassaFeverCasesLayer map={map.current} />
        </>
      )}
    </div>
  );
};