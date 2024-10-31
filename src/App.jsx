import React from 'react';
import LoginPage from './components/LoginPage';
import WeatherMap from './components/WeatherMap';
import { Toaster } from './components/ui/toaster';
import { initializeMapboxToken } from './utils/mapTokenManager';

try {
  initializeMapboxToken();
} catch (error) {
  console.error('Failed to initialize Mapbox:', error);
}

const App = () => {
  return (
    <div>
      <LoginPage />
      <WeatherMap />
      <Toaster />
    </div>
  );
};

export default App;
