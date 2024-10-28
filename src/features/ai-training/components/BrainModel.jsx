import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/card';

const BrainModel = ({ knowledgeLevel }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw brain visualization
    ctx.beginPath();
    ctx.fillStyle = `hsl(${knowledgeLevel * 2.4}, 70%, 50%)`; // Color changes based on knowledge level
    ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
    ctx.fill();

    // Add neural network connections
    ctx.strokeStyle = '#ffffff44';
    for (let i = 0; i < knowledgeLevel / 5; i++) {
      ctx.beginPath();
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const endX = Math.random() * width;
      const endY = Math.random() * height;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }, [knowledgeLevel]);

  return (
    <Card className="p-4 bg-gray-800 bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-2 text-white">Neural Network Visualization</h3>
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full h-full bg-gray-900"
          />
          <div className="absolute bottom-2 right-2 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            Knowledge Level: {knowledgeLevel}%
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

export default BrainModel;