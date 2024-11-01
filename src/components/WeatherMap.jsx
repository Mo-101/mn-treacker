import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { fetchRatData, fetchLassaFeverCases } from '../utils/api';
import MapContainer from './MapContainer';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import PredictionPanel from './PredictionPanel';
import DetectionSpotLayer from './DetectionSpotLayer';
import LassaFeverCasesLayer from './LassaFeverCasesLayer';
import WeatherControls from './WeatherControls';
import SidePanels from './SidePanels';
import MapLegend from './MapLegend';
import WindGLLayer from './WindGLLayer';

const WeatherMap = () => {
  const [mapState] = useState({ lng: 27.12657, lat: 3.46732, zoom: 2 });
  const [map, setMap] = useState(null);
  const [activeLayers, setActiveLayers] = useState(['precipitation', 'temperature', 'clouds', 'wind']);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(80);

  const { data: ratData } = useQuery({
    queryKey: ['rat-data'],
    queryFn: fetchRatData,
    staleTime: 300000,
  });

  const { data: lassaData } = useQuery({
    queryKey: ['lassa-cases'],
    queryFn: fetchLassaFeverCases,
    staleTime: 300000,
  });

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MapContainer mapState={mapState} onMapLoad={handleMapLoad} />
      
      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
        onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
      />

      {map && (
        <>
          <SidePanels
            leftPanelOpen={leftPanelOpen}
            rightPanelOpen={rightPanelOpen}
            setLeftPanelOpen={setLeftPanelOpen}
            setRightPanelOpen={setRightPanelOpen}
            activeLayers={activeLayers}
            layerOpacity={layerOpacity}
            setLayerOpacity={setLayerOpacity}
          />

          <AnimatePresence>
            {predictionPanelOpen && (
              <PredictionPanel
                isOpen={predictionPanelOpen}
                onClose={() => setPredictionPanelOpen(false)}
              />
            )}
          </AnimatePresence>

          <FloatingInsightsBar />

          <AnimatePresence>
            {aiTrainingOpen && (
              <AITrainingInterface
                isOpen={aiTrainingOpen}
                onClose={() => setAiTrainingOpen(false)}
              />
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 z-10">
            <WeatherControls
              activeLayers={activeLayers}
              layerOpacity={layerOpacity}
            />
          </div>

          <MapLegend activeLayers={activeLayers} />

          <DetectionSpotLayer map={map} detections={ratData?.features || []} />
          <LassaFeverCasesLayer map={map} cases={lassaData?.features || []} />
          <WindGLLayer map={map} />
        </>
      )}
    </div>
  );
};

export default WeatherMap;