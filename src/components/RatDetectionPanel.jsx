import React, { useState } from 'react';
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
    <div className="absolute top-20 right-4 w-80 bg-white/80 backdrop-blur-md rounded-lg shadow-lg text-black">
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
              className="bg-white/50 border-none text-black placeholder-gray-500"
            />
            <Button onClick={handleSearch} variant="outline" className="bg-white/50 hover:bg-white/70">
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {sightings.map((sighting, index) => (
              <div key={index} className="bg-white/50 p-2 rounded">
                <p>Latitude: {sighting.latitude.toFixed(4)}</p>
                <p>Longitude: {sighting.longitude.toFixed(4)}</p>
                <p>Confidence: {(sighting.confidence * 100).toFixed(2)}%</p>
              </div>
            ))}
          </div>
          {sightings.length === 0 && (
            <p className="text-center text-gray-500">No rat sightings detected</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RatDetectionPanel;