import React from 'react';
import { Slider } from './ui/slider';

const WindControls = ({ settings, onSettingsChange }) => {
  return (
    <div className="space-y-4 w-64">
      <div className="space-y-2">
        <label className="text-sm text-white">Particle Count</label>
        <Slider
          value={[settings.particleCount]}
          min={1024}
          max={589824}
          step={1024}
          onValueChange={([value]) => onSettingsChange({ ...settings, particleCount: value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white">Fade Opacity</label>
        <Slider
          value={[settings.opacity]}
          min={96}
          max={99.9}
          step={0.1}
          onValueChange={([value]) => onSettingsChange({ ...settings, opacity: value / 100 })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white">Speed Factor</label>
        <Slider
          value={[settings.speed]}
          min={5}
          max={100}
          onValueChange={([value]) => onSettingsChange({ ...settings, speed: value / 100 })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white">Drop Rate</label>
        <Slider
          value={[settings.dropRate]}
          min={0}
          max={10}
          step={0.1}
          onValueChange={([value]) => onSettingsChange({ ...settings, dropRate: value / 100 })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white">Drop Rate Bump</label>
        <Slider
          value={[settings.dropRateBump]}
          min={0}
          max={20}
          step={0.1}
          onValueChange={([value]) => onSettingsChange({ ...settings, dropRateBump: value / 100 })}
        />
      </div>
    </div>
  );
};

export default WindControls;