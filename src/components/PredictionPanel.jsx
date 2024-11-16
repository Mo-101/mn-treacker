import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplet, Wind, MapPin, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import MiniMap from './MiniMap';

const PredictionPanel = ({ isOpen, onClose, onDetailView }) => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [detectionEnabled, setDetectionEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState(75);

  const populationData = [
    { name: 'Jan', value: 4000, predicted: 4200 },
    { name: 'Feb', value: 3000, predicted: 3500 },
    { name: 'Mar', value: 2000, predicted: 2200 },
    { name: 'Apr', value: 2780, predicted: 3000 },
    { name: 'May', value: 1890, predicted: 2100 },
    { name: 'Jun', value: 2390, predicted: 2600 },
  ];

  const riskZones = [
    { area: 'Urban Edge', risk: 85 },
    { area: 'Grassland', risk: 65 },
    { area: 'Forest', risk: 45 },
    { area: 'Wetland', risk: 75 },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-[450px] bg-gray-900/95 backdrop-blur-md text-white p-6 overflow-y-auto z-50 shadow-2xl border-l border-white/10"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-400">Mastomys Detection Hub</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10">
          ✕
        </Button>
      </div>

      <div className="space-y-6">
        {/* Status Card */}
        <Card className="bg-gray-800/50 border-cyan-500/30 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-cyan-400 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Detection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm">Active Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">3 Risk Zones</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mini Map */}
        <Card className="bg-gray-800/50 border-cyan-500/30 border overflow-hidden">
          <MiniMap />
        </Card>

        {/* Population Trend */}
        <Card className="bg-gray-800/50 border-cyan-500/30 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-cyan-400">Population Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              {['weekly', 'monthly', 'yearly'].map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className={timeframe === tf ? 'bg-cyan-500' : 'hover:bg-white/10'}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </Button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={populationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" stroke="#818cf8" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Zones */}
        <Card className="bg-gray-800/50 border-cyan-500/30 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-cyan-400">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskZones}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="area" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="risk" fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detection Controls */}
        <Card className="bg-gray-800/50 border-cyan-500/30 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-cyan-400">Detection Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Active Detection</span>
              <Switch
                checked={detectionEnabled}
                onCheckedChange={setDetectionEnabled}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sensitivity</span>
                <span>{sensitivity}%</span>
              </div>
              <Slider
                value={[sensitivity]}
                onValueChange={(value) => setSensitivity(value[0])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Environmental Data */}
        <Card className="bg-gray-800/50 border-cyan-500/30 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-cyan-400">Environmental Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <Thermometer className="w-5 h-5 text-red-400 mb-1" />
                <span className="text-sm">28°C</span>
              </div>
              <div className="flex flex-col items-center">
                <Droplet className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-sm">65%</span>
              </div>
              <div className="flex flex-col items-center">
                <Wind className="w-5 h-5 text-green-400 mb-1" />
                <span className="text-sm">12km/h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={onDetailView} 
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          View on Main Map
        </Button>
      </div>
    </motion.div>
  );
};

export default PredictionPanel;