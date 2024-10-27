import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherMap from './features/weather/components/WeatherMap';
import AITrainingInterface from './features/ai-training/components/AITrainingInterface';
import TopNavigationBar from './components/TopNavigationBar';
import BottomPanel from './components/BottomPanel';

const App = () => {
  return (
    <Router>
      <div className="h-screen flex flex-col">
        <TopNavigationBar />
        <main className="flex-1 relative">
          <Routes>
            <Route path="/" element={<WeatherMap />} />
            <Route path="/ai-training" element={<AITrainingInterface />} />
          </Routes>
        </main>
        <BottomPanel />
      </div>
    </Router>
  );
};

export default App;