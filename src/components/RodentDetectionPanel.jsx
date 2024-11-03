import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Search, ChevronDown, ChevronUp, Droplet, Thermometer, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const RodentDetectionPanel = ({ isOpen, onToggle, detections }) => {
  const [expandedDetection, setExpandedDetection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  const filteredDetections = detections.filter(detection => {
    const matchesSearch = detection.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTime = timeFilter === 'all' || detection.timeFrame === timeFilter;
    const matchesRegion = regionFilter === 'all' || detection.region === regionFilter;
    return matchesSearch && matchesTime && matchesRegion;
  });

  const totalDetections = filteredDetections.length;
  const recentDetections = filteredDetections.filter(d => d.isRecent).length;
  const highDensityDetections = filteredDetections.filter(d => d.isHighDensity).length;

  const regionData = [
    { name: 'Urban', value: 30 },
    { name: 'Rural', value: 50 },
    { name: 'Forest', value: 20 },
  ];

  const typeData = [
    { name: 'Recent', value: recentDetections },
    { name: 'High Density', value: highDensityDetections },
    { name: 'Historic', value: totalDetections - recentDetections - highDensityDetections },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-96 bg-black/70 backdrop-blur-lg text-white p-4 overflow-y-auto"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-black/70"
      >
        {isOpen ? <ChevronRight /> : <ChevronLeft />}
      </Button>

      <CardHeader>
        <CardTitle className="text-2xl font-bold">Rodent Detection Overview</CardTitle>
        <div className="flex justify-between mt-2">
          <span>Total: {totalDetections}</span>
          <span className="text-green-400">Recent: {recentDetections}</span>
          <span className="text-red-400">High Density: {highDensityDetections}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/20 border-none"
          />
          <div className="flex space-x-2">
            <Select onValueChange={setTimeFilter} defaultValue="all">
              <SelectTrigger className="w-full bg-white/20 border-none">
                <SelectValue placeholder="Time Frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setRegionFilter} defaultValue="all">
              <SelectTrigger className="w-full bg-white/20 border-none">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="urban">Urban</SelectItem>
                <SelectItem value="rural">Rural</SelectItem>
                <SelectItem value="forest">Forest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {filteredDetections.map((detection, index) => (
              <Card key={index} className="bg-white/10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{detection.location}</p>
                      <p className="text-sm">{detection.timestamp}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${detection.isHighDensity ? 'bg-red-500' : 'bg-green-500'}`} />
                  </div>
                  <p className="text-sm mt-2">{detection.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setExpandedDetection(expandedDetection === index ? null : index)}
                  >
                    {expandedDetection === index ? <ChevronUp /> : <ChevronDown />}
                    {expandedDetection === index ? 'Less' : 'More'} Details
                  </Button>
                  {expandedDetection === index && (
                    <div className="mt-2 space-y-2">
                      <p><Droplet className="inline mr-2" /> Nearby Water: {detection.nearbyWater}</p>
                      <p><Thermometer className="inline mr-2" /> Temperature: {detection.temperature}°C</p>
                      <p><Wind className="inline mr-2" /> Wind: {detection.windSpeed} km/h</p>
                      <p>Risk Assessment: {detection.riskAssessment}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <div className="w-1/2">
              <h3 className="text-center mb-2">Detections by Region</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={regionData}>
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2">
              <h3 className="text-center mb-2">Detection Types</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </motion.div>
  );
};

export default RodentDetectionPanel;