import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Rat } from 'lucide-react';

const RatDetectionPanel = ({ sightings, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 left-4 w-80 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-white overflow-hidden z-10"
    >
      <Card className="bg-transparent border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Rat className="mr-2" /> Mastomys natalensis Detector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Search for rat sightings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/20 border-none text-white placeholder-white/50"
            />
            <Button onClick={handleSearch} variant="outline" className="bg-white/20 hover:bg-white/30">
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sightings.map((sighting, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/20 p-2 rounded"
              >
                <p>Latitude: {sighting.latitude.toFixed(4)}</p>
                <p>Longitude: {sighting.longitude.toFixed(4)}</p>
                <p>Confidence: {(sighting.confidence * 100).toFixed(2)}%</p>
              </motion.div>
            ))}
          </div>
          {sightings.length === 0 && (
            <p className="text-center text-gray-300">No rat sightings detected</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RatDetectionPanel;