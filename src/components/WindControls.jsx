import React from 'react';
import { Slider } from './ui/slider';

const WindControls = ({ 
  particleCount, 
  setParticleCount,
  fadeOpacityFactor,
  setFadeOpacityFactor,
  resetRateFactor,
  setResetRateFactor,
  speedFactor,
  setSpeedFactor 
}) => {
  return (
    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm p-4 rounded-lg space-y-4 text-white">
      <div>
        <label className="block text-sm mb-2">Particle Count ({particleCount})</label>
        <Slider
          value={[particleCount]}
          onValueChange={(value) => setParticleCount(value[0])}
          min={1}
          max={4096}
          step={1}
          className="w-48"
        />
      </div>
      <div>
        <label className="block text-sm mb-2">Opacity Factor ({fadeOpacityFactor.toFixed(2)})</label>
        <Slider
          value={[fadeOpacityFactor * 100]}
          onValueChange={(value) => setFadeOpacityFactor(value[0] / 100)}
          min={0}
          max={100}
          step={1}
          className="w-48"
        />
      </div>
      <div>
        <label className="block text-sm mb-2">Reset Rate ({resetRateFactor.toFixed(2)})</label>
        <Slider
          value={[resetRateFactor * 100]}
          onValueChange={(value) => setResetRateFactor(value[0] / 100)}
          min={0}
          max={100}
          step={1}
          className="w-48"
        />
      </div>
      <div>
        <label className="block text-sm mb-2">Speed Factor ({speedFactor.toFixed(2)})</label>
        <Slider
          value={[speedFactor * 100]}
          onValueChange={(value) => setSpeedFactor(value[0] / 100)}
          min={0}
          max={100}
          step={1}
          className="w-48"
        />
      </div>
    </div>
  );
};

export default WindControls;