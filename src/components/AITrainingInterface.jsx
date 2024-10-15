import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BarChart2, Map, Settings, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import TopNavigationBar from './AITrainingComponents/TopNavigationBar';
import InteractiveSidebar from './AITrainingComponents/InteractiveSidebar';
import TrainingControlsPanel from './AITrainingComponents/TrainingControlsPanel';
import HelpSection from './AITrainingComponents/HelpSection';
import BrainModel from './AITrainingComponents/BrainModel';

const DataUploadSection = lazy(() => import('./AITrainingComponents/DataUploadSection'));
const ModelPerformanceDashboard = lazy(() => import('./AITrainingComponents/ModelPerformanceDashboard'));
const DataVisualizationPanel = lazy(() => import('./AITrainingComponents/DataVisualizationPanel'));
const SettingsPanel = lazy(() => import('./AITrainingComponents/SettingsPanel'));

const AITrainingInterface = ({ isOpen, onClose, addToConsoleLog }) => {
  const [activeSection, setActiveSection] = useState('upload');
  const [showHelp, setShowHelp] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [dataUploaded, setDataUploaded] = useState(false);
  const [trainingActivities, setTrainingActivities] = useState([]);
  const [timeLeft, setTimeLeft] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [knowledgeLevel, setKnowledgeLevel] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(null);
  const [isValidated, setIsValidated] = useState(false);
  const [ratLocations, setRatLocations] = useState(null);
  const [lassaFeverCases, setLassaFeverCases] = useState(null);

  const navItems = [
    { icon: Upload, label: 'Upload', section: 'upload' },
    { icon: BarChart2, label: 'Performance', section: 'performance' },
    { icon: Map, label: 'Visualization', section: 'visualization' },
    { icon: Settings, label: 'Settings', section: 'settings' },
  ];

  useEffect(() => {
    fetchRatLocations();
    fetchLassaFeverCases();
  }, []);

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(fetchTrainingProgress, 1000);
      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const fetchRatLocations = async () => {
    try {
      const response = await fetch('/api/rat-locations');
      const data = await response.json();
      setRatLocations(data);
    } catch (error) {
      addToConsoleLog(`Error fetching rat locations: ${error}`);
    }
  };

  const fetchLassaFeverCases = async () => {
    try {
      const response = await fetch('/api/cases');
      const data = await response.json();
      setLassaFeverCases(data);
    } catch (error) {
      addToConsoleLog(`Error fetching Lassa fever cases: ${error}`);
    }
  };

  const fetchTrainingProgress = async () => {
    try {
      const response = await fetch('/api/training-progress');
      const data = await response.json();
      setTrainingProgress(data.progress);
      setIsTraining(data.is_training);
      if (data.progress >= 100) {
        setIsTraining(false);
        monitorModelAccuracy();
      }
    } catch (error) {
      addToConsoleLog(`Error fetching training progress: ${error}`);
    }
  };

  const handleStartTraining = async () => {
    if (isValidated && dataUploaded) {
      try {
        await fetch('/api/start-training', { method: 'POST' });
        setIsTraining(true);
        addToConsoleLog('Training started');
      } catch (error) {
        addToConsoleLog(`Error starting training: ${error}`);
      }
    } else {
      addToConsoleLog('Data validation required before training.');
    }
  };

  const handleDataUpload = () => {
    setDataUploaded(true);
    validateData();
    addToConsoleLog('Data uploaded successfully');
  };

  const validateData = async () => {
    try {
      const response = await fetch('/api/validate-data');
      const result = await response.json();
      setIsValidated(result.isValid);
      addToConsoleLog('Data validation completed');
    } catch (error) {
      addToConsoleLog(`Data validation error: ${error}`);
    }
  };

  const monitorModelAccuracy = async () => {
    try {
      const response = await fetch('/api/monitor-accuracy');
      const data = await response.json();
      setModelAccuracy(data.accuracy);
      addToConsoleLog(`Model accuracy: ${data.accuracy.toFixed(2)}%`);
    } catch (error) {
      addToConsoleLog(`Error fetching model accuracy: ${error}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-gray-900 text-white overflow-hidden z-50 flex flex-col"
    >
      <TopNavigationBar 
        navItems={navItems} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onClose={onClose}
      />

      <div className="flex-grow flex overflow-hidden">
        <InteractiveSidebar />

        <div className="flex-grow overflow-auto p-4 space-y-4">
          <AnimatePresence mode="wait">
            <Suspense fallback={<div>Loading...</div>}>
              {activeSection === 'upload' && <DataUploadSection onUploadComplete={handleDataUpload} />}
              {activeSection === 'performance' && <ModelPerformanceDashboard accuracy={modelAccuracy} />}
              {activeSection === 'visualization' && <DataVisualizationPanel ratLocations={ratLocations} lassaFeverCases={lassaFeverCases} />}
              {activeSection === 'settings' && <SettingsPanel />} 
            </Suspense>
          </AnimatePresence>

          <BrainModel knowledgeLevel={knowledgeLevel} />

          <TrainingControlsPanel 
            onStartTraining={handleStartTraining}
            isTraining={isTraining}
            trainingProgress={trainingProgress}
            dataUploaded={dataUploaded}
            trainingActivities={trainingActivities}
            timeLeft={timeLeft}
            elapsedTime={elapsedTime}
            accuracy={modelAccuracy}
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 rounded-full"
        onClick={() => setShowHelp(true)}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {showHelp && (
          <HelpSection onClose={() => setShowHelp(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AITrainingInterface;