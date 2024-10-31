import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './components/LoginPage';
import WeatherMap from './components/WeatherMap';
import FirebaseTest from './components/FirebaseTest';
import { Toaster } from './components/ui/toaster';
import { initializeMapboxToken } from './utils/mapTokenManager';
import 'mapbox-gl/dist/mapbox-gl.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    try {
      initializeMapboxToken();
    } catch (error) {
      console.error('Failed to initialize Mapbox:', error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <FirebaseTest />
        <LoginPage />
        <WeatherMap />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
};

export default App;