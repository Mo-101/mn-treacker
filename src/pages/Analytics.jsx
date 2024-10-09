import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import DashboardComponents from '../components/DashboardComponents';

const Analytics = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button 
        onClick={() => setShowAnalytics(!showAnalytics)}
        className="mb-6"
      >
        {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
      </Button>
      {showAnalytics && <DashboardComponents />}
    </div>
  );
};

export default Analytics;