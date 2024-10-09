import React from 'react';
import WeatherMap from '../components/WeatherMap';
import DashboardComponents from '../components/DashboardComponents';

const Index = () => {
  return (
    <div className="flex flex-col h-screen">
      <WeatherMap />
      <DashboardComponents />
    </div>
  );
};

export default Index;