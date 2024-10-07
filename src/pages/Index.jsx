import React from 'react';
import WeatherMap from '../components/WeatherMap';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h1 className="text-2xl font-bold">Nigeria Weather Map - Mastomys natalensis Tracker</h1>
      </header>
      <main className="flex-grow">
        <WeatherMap />
      </main>
    </div>
  );
};

export default Index;