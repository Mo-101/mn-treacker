import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from './ui/use-toast';
import DetectionSpotLayer from './DetectionSpotLayer';
import LassaFeverCasesLayer from './LassaFeverCasesLayer';
import { addCustomLayers } from '../utils/mapLayers';
import { MOCK_DATA } from '../config/apiConfig';

export const WeatherMapContainer = ({ mapState, activeLayers, layerOpacity }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (map.current) return;
    
    try {
      if (!mapboxgl.accessToken) {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 0
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', async () => {
        try {
          await addCustomLayers(map.current);
          setMapLoaded(true);
        } catch (error) {
          console.error('Error adding custom layers:', error);
          toast({
            title: "Warning",
            description: "Some map layers could not be loaded",
            variant: "warning",
          });
        }
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
    if (!map.current || !mapLoaded) return;
    
    activeLayers.forEach(layerId => {
      if (map.current.getLayer(layerId)) {
        map.current.setPaintProperty(layerId, 'raster-opacity', layerOpacity / 100);
      }
    });
  }, [activeLayers, layerOpacity, mapLoaded]);

  return (
    <div ref={mapContainer} className="absolute inset-0">
      {map.current && mapLoaded && (
        <>
          <DetectionSpotLayer 
            map={map.current} 
            detections={MOCK_DATA.DETECTIONS} 
          />
          <LassaFeverCasesLayer 
            map={map.current} 
            initialCases={MOCK_DATA.LASSA_CASES}
          />
        </>
      )}
    </div>
  );
};