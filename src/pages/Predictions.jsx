import React from 'react';
import PredictionPanel from '../components/PredictionPanel';

const Predictions = () => {
  return (
    <div className="w-screen h-screen">
      <PredictionPanel isOpen={true} />
    </div>
  );
};

export default Predictions;