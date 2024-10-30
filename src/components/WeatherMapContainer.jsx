import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from './ui/use-toast';
import DetectionSpotLayer from './DetectionSpotLayer';
import LassaFeverCasesLayer from './LassaFeverCasesLayer';
import { addCustomLayers } from '../utils/mapLayers';

export const WeatherMapContainer = ({ mapState, activeLayers, layerOpacity, detections }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return;
    
    try {
      const customStyle = {
        version: 8,
        sources: {
          'google-satellite': {
            type: 'raster',
            tiles: ['https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'],
            tileSize: 256
          },
          'google-hybrid': {
            type: 'raster',
            tiles: ['https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'satellite-base',
            type: 'raster',
            source: 'google-satellite',
            minzoom: 0,
            maxzoom: 22
          },
          {
            id: 'hybrid-overlay',
            type: 'raster',
            source: 'google-hybrid',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      };

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: customStyle,
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        bearing: 360.0,
        pitch: 0,
        attributionControl: false
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');
      map.current.addControl(new mapboxgl.AttributionControl({
        customAttribution: 'Imagery © Google',
        compact: false
      }));

      map.current.on('load', async () => {
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
  }, []);

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