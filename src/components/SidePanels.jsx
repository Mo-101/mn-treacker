import React from 'react';
import { AnimatePresence } from 'framer-motion';
import LeftSidePanel from './LeftSidePanel';
import RightSidePanel from './RightSidePanel';

const SidePanels = ({
  leftPanelOpen,
  rightPanelOpen,
  setLeftPanelOpen,
  setRightPanelOpen,
  activeLayers,
  handleLayerToggle,
  handleOpacityChange,
  handleSelectAllLayers,
  selectedPoint
}) => {
  return (
    <>
      <AnimatePresence>
        {leftPanelOpen && (
          <div className="pointer-events-auto">
            <LeftSidePanel 
              isOpen={leftPanelOpen} 
              onClose={() => setLeftPanelOpen(false)}
              activeLayers={activeLayers}
              onLayerToggle={handleLayerToggle}
              onOpacityChange={handleOpacityChange}
              layers={['precipitation', 'temp', 'clouds', 'wind']}
              selectAll={false}
              onSelectAllLayers={handleSelectAllLayers}
            />
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {rightPanelOpen && (
          <div className="pointer-events-auto">
            <RightSidePanel 
              isOpen={rightPanelOpen} 
              onClose={() => setRightPanelOpen(false)}
              selectedPoint={selectedPoint}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidePanels;