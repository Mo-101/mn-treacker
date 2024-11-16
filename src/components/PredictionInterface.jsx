import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Battery, Thermometer, Wind, Cloud, Clock, Settings } from 'lucide-react';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Button } from './ui/button';

const PredictionInterface = ({ onClose }) => {
  const [altitude, setAltitude] = useState(200);
  const [resolution, setResolution] = useState(8);
  const [activeDetection, setActiveDetection] = useState(true);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto p-4">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-4 bg-gray-900/50 p-2 rounded-lg">
          <div className="flex items-center space-x-4">
            <MapPin className="text-primary" />
            <span>Overview</span>
            <span>Routes</span>
            <span>Map view</span>
          </div>
          <div className="flex items-center space-x-4 text-muted-foreground">
            <span>243.4 km²</span>
            <div className="flex items-center">
              <Cloud className="mr-1" />
              <span>28°C</span>
            </div>
            <div className="bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded">
              Active • 12%
            </div>
            <Clock />
            <span>11:43 AM</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Map View */}
          <Card className="lg:col-span-3 bg-gray-900/50 p-4">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <div id="map" className="absolute inset-0" />
              {/* Crosshair Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-primary/50 rounded-full" />
                <div className="absolute w-px h-20 bg-primary/50" />
                <div className="absolute w-20 h-px bg-primary/50" />
              </div>
            </div>
          </Card>

          {/* Control Panel */}
          <Card className="bg-gray-900/50 p-4 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">MHMR-3200</h2>
              <p className="text-sm text-muted-foreground">
                Mastomys habitat monitoring and detection system
              </p>
            </div>

            {/* Battery Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Battery className="text-orange-500" />
                <span>2563 / 4366 mAh</span>
                <Thermometer />
                <span>27°C</span>
              </div>
            </div>

            {/* Altitude Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Altitude limited</label>
              <Slider
                value={[altitude]}
                onValueChange={(value) => setAltitude(value[0])}
                max={300}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10 ML</span>
                <span>300 ML</span>
              </div>
            </div>

            {/* Resolution Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution px</label>
              <Slider
                value={[resolution]}
                onValueChange={(value) => setResolution(value[0])}
                max={16}
                step={2}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2px</span>
                <span>16px</span>
              </div>
            </div>

            {/* Detection Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Active Detection</span>
                <Switch
                  checked={activeDetection}
                  onCheckedChange={setActiveDetection}
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Start Monitoring
              </Button>
            </div>
          </Card>
        </div>

        {/* Bottom Panel */}
        <Card className="mt-4 bg-gray-900/50 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center">
                <Wind className="mr-2" />
                <span>Speed</span>
              </div>
              <span className="text-xl">22 km/h</span>
            </div>
            <div className="space-y-1">
              <span>Height</span>
              <span className="text-xl">83 m</span>
            </div>
            <div className="space-y-1">
              <span>Detection Rate</span>
              <span className="text-xl">98%</span>
            </div>
            <div className="space-y-1">
              <span>Coverage</span>
              <span className="text-xl">1920x1080</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PredictionInterface;