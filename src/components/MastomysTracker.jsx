import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const MastomysTracker = ({ sightings }) => {
  const sightingsArray = sightings?.features || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute right-4 top-20 w-80"
    >
      <Card className="bg-black/50 text-white backdrop-blur-md border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Mastomys Sightings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sightingsArray.map((sighting, index) => (
              <div key={index} className="bg-white/20 p-2 rounded">
                <p>Longitude: {sighting.geometry.coordinates[0]}</p>
                <p>Latitude: {sighting.geometry.coordinates[1]}</p>
                <p>Time: {new Date(sighting.properties.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
          {sightingsArray.length === 0 && (
            <p className="text-center text-gray-300">No sightings found</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MastomysTracker;