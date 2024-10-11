import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BarChart2, Map, Settings, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import TopNavigationBar from './AITrainingComponents/TopNavigationBar';
import DataUploadSection from './AITrainingComponents/DataUploadSection';
import ModelPerformanceDashboard from './AITrainingComponents/ModelPerformanceDashboard';
import DataVisualizationPanel from './AITrainingComponents/DataVisualizationPanel';
import TrainingControlsPanel from './AITrainingComponents/TrainingControlsPanel';
import InteractiveSidebar from './AITrainingComponents/InteractiveSidebar';
import HelpSection from './AITrainingComponents/HelpSection';

const AITrainingInterface = ({ isOpen, onClose, addToConsoleLog }) => {
  const [activeSection, setActiveSection] = useState('upload');
  const [showHelp, setShowHelp] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [dataUploaded, setDataUploaded] = useState(false);
  const [trainingActivities, setTrainingActivities] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const navItems = [
    { icon: Upload, label: 'Upload', section: 'upload' },
    { icon: BarChart2, label: 'Performance', section: 'performance' },
    { icon: Map, label: 'Visualization', section: 'visualization' },
    { icon: Settings, label: 'Settings', section: 'settings' },
  ];

  useEffect(() => {
    let interval;
    if (isTraining) {
      interval = setInterval(() => {
        setTrainingProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsTraining(false);
            addToConsoleLog('Training completed');
            return 100;
          }
          setElapsedTime(prev => prev + 1);
          setTimeLeft(prev => Math.max(0, prev - 1));
          setTrainingActivities(prev => [...prev, `Training step ${newProgress} completed`]);
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTraining, addToConsoleLog]);

  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setElapsedTime(0);
    setTimeLeft(100); // Assuming 100 seconds for training
    setTrainingActivities([]);
    addToConsoleLog('Training started');
  };

  const handleDataUpload = () => {
    setDataUploaded(true);
    addToConsoleLog('Data uploaded successfully');
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
            {activeSection === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DataUploadSection onUploadComplete={handleDataUpload} />
              </motion.div>
            )}

            {activeSection === 'performance' && (
              <motion.div
                key="performance"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ModelPerformanceDashboard />
              </motion.div>
            )}

            {activeSection === 'visualization' && (
              <motion.div
                key="visualization"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DataVisualizationPanel />
              </motion.div>
            )}

            {activeSection === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-xl font-bold mb-4">Settings</h2>
                {/* Add settings controls here */}
              </motion.div>
            )}
          </AnimatePresence>

          <TrainingControlsPanel 
            onStartTraining={handleStartTraining}
            isTraining={isTraining}
            trainingProgress={trainingProgress}
            dataUploaded={dataUploaded}
            trainingActivities={trainingActivities}
            timeLeft={timeLeft}
            elapsedTime={elapsedTime}
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