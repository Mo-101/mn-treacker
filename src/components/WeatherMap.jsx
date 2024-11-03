import React, { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useQuery } from '@tanstack/react-query';
import { fetchMastomysLocations, fetchLassaFeverCases } from '../utils/api';
import { WeatherLayerManager } from '../utils/weatherLayerManager';
import TopNavigationBar from './TopNavigationBar';
import SidePanels from './SidePanels';
import { useToast } from './ui/use-toast';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const weatherLayerManager = useRef(null);
  const [mapState, setMapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [activeLayers, setActiveLayers] = useState(['precipitation', 'temperature', 'clouds', 'wind', 'cases', 'points']);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const { toast } = useToast();

  // Fetch data using React Query
  const { data: ratLocations } = useQuery({
    queryKey: ['ratLocations'],
    queryFn: fetchMastomysLocations,
    staleTime: 300000
  });

  const { data: lassaCases } = useQuery({
    queryKey: ['lassaCases'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000
  });

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    }

    if (map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      map.current.on('load', async () => {
        // Initialize terrain
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });

        map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

        // Initialize weather layer manager
        weatherLayerManager.current = new WeatherLayerManager(
          map.current,
          import.meta.env.VITE_OPENWEATHER_API_KEY
        );
        await weatherLayerManager.current.initializeLayers();

        // Add rat locations source and layer
        if (ratLocations) {
          map.current.addSource('rat-points', {
            type: 'geojson',
            data: ratLocations
          });

          map.current.addLayer({
            id: 'points',
            type: 'circle',
            source: 'rat-points',
            paint: {
              'circle-radius': 6,
              'circle-color': '#FFD700',
              'circle-opacity': 0.8,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff'
            }
          });
        }

        // Add Lassa fever cases source and layer
        if (lassaCases) {
          map.current.addSource('lassa-cases', {
            type: 'geojson',
            data: lassaCases
          });

          map.current.addLayer({
            id: 'cases',
            type: 'circle',
            source: 'lassa-cases',
            paint: {
              'circle-radius': 8,
              'circle-color': '#FF4136',
              'circle-opacity': 0.8,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff'
            }
          });
        }

        // Set initial layer visibility
        activeLayers.forEach(layerId => {
          if (map.current.getLayer(layerId)) {
            map.current.setLayoutProperty(layerId, 'visibility', 'visible');
          }
        });

        // Add popups for points and cases
        map.current.on('click', 'points', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold">Rat Location</h3>
                <p>Coordinates: ${coordinates}</p>
                ${Object.entries(properties).map(([key, value]) => 
                  `<p>${key}: ${value}</p>`
                ).join('')}
              </div>
            `)
            .addTo(map.current);
        });

        map.current.on('click', 'cases', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold">Lassa Fever Case</h3>
                <p>Coordinates: ${coordinates}</p>
                ${Object.entries(properties).map(([key, value]) => 
                  `<p>${key}: ${value}</p>`
                ).join('')}
              </div>
            `)
            .addTo(map.current);
        });
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your configuration.",
        variant: "destructive",
      });
    }

    return () => map.current?.remove();
  }, [ratLocations, lassaCases]);

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => {
      const isActive = prev.includes(layerId);
      const newLayers = isActive
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId];
      
      if (map.current && map.current.getLayer(layerId)) {
        map.current.setLayoutProperty(
          layerId,
          'visibility',
          isActive ? 'none' : 'visible'
        );
      }
      
      return newLayers;
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
      />

      <SidePanels
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        setLeftPanelOpen={setLeftPanelOpen}
        setRightPanelOpen={setRightPanelOpen}
        activeLayers={activeLayers}
        handleLayerToggle={handleLayerToggle}
      />
    </div>
  );
};

export default WeatherMap;