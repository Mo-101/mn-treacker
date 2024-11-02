import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const RatTracker = ({ sightings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 right-4 w-80 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-white overflow-hidden"
    >
      <Card className="bg-transparent border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Mastomys natalensis Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sightings.map((sighting, index) => (
              <div key={index} className="bg-white/20 p-2 rounded">
                <p>Latitude: {sighting.latitude}</p>
                <p>Longitude: {sighting.longitude}</p>
                <p>Confidence: {(sighting.confidence * 100).toFixed(2)}%</p>
              </div>
            ))}
          </div>
          {sightings.length === 0 && (
            <p className="text-center text-gray-300">No rat sightings found</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RatTracker;