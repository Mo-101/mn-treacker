import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import BottomPanel from './BottomPanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import AerisWeather from '@aerisweather/javascript-sdk';

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const aerisApp = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8.6753, lat: 9.0820, zoom: 5 }); // Updated to center on Nigeria
  const [activeLayers, setActiveLayers] = useState([]);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);

  useEffect(() => {
    const aeris = new AerisWeather('r8ZBl3l7eRPGBVBs3B2GD', 'e3LxlhWReUM20kV7pkCTssDcl0c99dKtJ7A93ygW');

    aeris.apps().then((apps) => {
      aerisApp.current = new apps.InteractiveMapApp(mapContainer.current, {
        map: {
          strategy: "mapbox",
          accessToken: "pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g",
          zoom: mapState.zoom,
          center: {
            lat: mapState.lat,
            lon: mapState.lng
          },
          timeline: {
            from: -7200,
            to: 0
          }
        },
        panels: {
          layers: {
            buttons: [
              { title: "Radar", value: "radar" },
              { title: "Radar - Global (Derived)", value: "radar-global" },
              { title: "Forecast Radar", value: "fradar" },
              { title: "Satellite - GeoColor", value: "satellite-geocolor" },
              { title: "Satellite - Infrared (Color)", value: "satellite-infrared-color" },
              { title: "Forecast Satellite", value: "fsatellite" }
            ],
            enabled: true,
            toggleable: false,
            position: {
              pin: "topright",
              translate: { x: 2, y: 15 }
            }
          },
          timeline: {
            enabled: true,
            toggleable: false,
            position: {
              pin: "bottom",
              translate: { x: 0, y: -16 }
            }
          },
          search: {
            enabled: true,
            toggleable: false,
            position: {
              pin: "bottomright",
              translate: { x: -10, y: -10 }
            }
          },
          legends: {
            enabled: true,
            toggleable: true,
            position: {
              pin: "bottomright",
              translate: { x: -10, y: -10 }
            }
          },
          info: {
            enabled: true,
            position: {
              pin: "topleft",
              translate: { x: 10, y: 10 }
            },
            metric: true
          }
        }
      });

      aerisApp.current.on('ready', () => {
        aerisApp.current.panels.info.setContentView('localweather', {
          views: [
            { renderer: "place" },
            { renderer: "obs" },
            { renderer: "threats" },
            { renderer: "forecast" },
            { renderer: "alerts" },
            { renderer: "outlook" },
            { renderer: "hazards" },
            { renderer: "units" }
          ]
        });

        aerisApp.current.map.on('click', (e) => {
          aerisApp.current.showInfoAtCoord(e.data.coord, 'localweather', 'Local Weather');
        });

        aerisApp.current.map.addLayers(['radar', 'radar-global', 'fradar', 'satellite-geocolor', 'satellite-infrared-color', 'fsatellite']);
        aerisApp.current.map.timeline.play();
      });
    });

    return () => {
      if (aerisApp.current) {
        aerisApp.current.destroy();
      }
    };
  }, []);

  const handleLayerChange = (layer) => {
    setActiveLayers(prev => 
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const handleOpacityChange = (opacity) => {
    setLayerOpacity(opacity);
  };

  const handleSearch = async (query) => {
    console.log('Searching for:', query);
    // Implement search functionality using Aeris SDK if needed
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#0f172a] text-white">
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
      />
      <div className="flex-grow relative">
        <div ref={mapContainer} className="absolute inset-0" />
        <AnimatePresence>
          {leftPanelOpen && (
            <LeftSidePanel 
              isOpen={leftPanelOpen} 
              onClose={() => setLeftPanelOpen(false)}
              activeLayers={activeLayers}
              onLayerChange={handleLayerChange}
              onOpacityChange={handleOpacityChange}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {rightPanelOpen && (
            <RightSidePanel 
              isOpen={rightPanelOpen} 
              onClose={() => setRightPanelOpen(false)}
              selectedPoint={selectedPoint}
            />
          )}
        </AnimatePresence>
        <BottomPanel />
      </div>
      <FloatingInsightsBar />
      <AnimatePresence>
        {aiTrainingOpen && (
          <AITrainingInterface
            isOpen={aiTrainingOpen}
            onClose={() => setAiTrainingOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherMap;
