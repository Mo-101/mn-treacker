import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './components/LoginPage';
import WeatherMap from './components/WeatherMap';
import FirebaseTest from './components/FirebaseTest';
import { Toaster } from './components/ui/toaster';
import { initializeMapboxToken } from './utils/mapTokenManager';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import 'mapbox-gl/dist/mapbox-gl.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    try {
      initializeMapboxToken();
    } catch (error) {
      console.error('Failed to initialize Mapbox:', error);
    }
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      {!user ? (
        <LoginPage />
      ) : (
        <>
          <FirebaseTest />
          <WeatherMap />
        </>
      )}
      <Toaster />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;