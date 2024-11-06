import React, { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import { useToast } from './ui/use-toast';
import TopNavigationBar from './TopNavigationBar';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';
import FloatingInsightsBar from './FloatingInsightsButton';
import AITrainingInterface from './AITrainingInterface';
import MastomysTracker from './MastomysTracker';
import PredictionPanel from './PredictionPanel';
import MapInitializer from './MapInitializer';
import WindParticleLayer from './WindParticleLayer';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const WeatherMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapState, setMapState] = useState({ lng: 8, lat: 10, zoom: 5 });
  const [activeLayers, setActiveLayers] = useState([]);
  const { toast } = useToast();
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [aiTrainingOpen, setAiTrainingOpen] = useState(false);
  const [mastomysData, setMastomysData] = useState([]);
  const [predictionPanelOpen, setPredictionPanelOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  const layers = ['precipitation', 'temp', 'clouds', 'wind'];

  const handleMapError = (error) => {
    console.error('Map error:', error);
  };

  return (
    <div className="relative w-screen h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <MapInitializer 
        map={map}
        mapContainer={mapContainer}
        mapState={mapState}
        onError={handleMapError}
      />

      <WindParticleLayer map={map} />

      <TopNavigationBar 
        onLayerToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        onAITrainingToggle={() => setAiTrainingOpen(!aiTrainingOpen)}
        onPredictionToggle={() => setPredictionPanelOpen(!predictionPanelOpen)}
      />

      <AnimatePresence>
        {leftPanelOpen && (
          <LeftSidePanel 
            isOpen={leftPanelOpen}
            onClose={() => setLeftPanelOpen(false)}
            layers={layers}
            activeLayers={activeLayers}
            onLayerToggle={setActiveLayers}
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

      <FloatingInsightsBar />

      <AnimatePresence>
        {aiTrainingOpen && (
          <AITrainingInterface
            isOpen={aiTrainingOpen}
            onClose={() => setAiTrainingOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {predictionPanelOpen && (
          <PredictionPanel
            isOpen={predictionPanelOpen}
            onClose={() => setPredictionPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      <MastomysTracker data={mastomysData} />
    </div>
  );
};

export default WeatherMap;