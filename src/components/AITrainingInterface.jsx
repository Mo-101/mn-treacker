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
import BrainModel from './AITrainingComponents/BrainModel';

const AITrainingInterface = ({ isOpen, onClose, addToConsoleLog }) => {
  const [activeSection, setActiveSection] = useState('upload');
  const [showHelp, setShowHelp] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [dataUploaded, setDataUploaded] = useState(false);
  const [trainingActivities, setTrainingActivities] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [knowledgeLevel, setKnowledgeLevel] = useState(0);

  const navItems = [
    { icon: Upload, label: 'Upload', section: 'upload' },
    { icon: BarChart2, label: 'Performance', section: 'performance' },
    { icon: Map, label: 'Visualization', section: 'visualization' },
    { icon: Settings, label: 'Settings', section: 'settings' },
  ];

  useEffect(() => {
    let interval;
    if (isTraining) {
      interval = setInterval(async () => {
        try {
          const response = await fetch('/api/training-progress');
          const data = await response.json();
          setTrainingProgress(data.progress);
          setIsTraining(data.is_training);
          if (!data.is_training) {
            clearInterval(interval);
            addToConsoleLog('Training completed');
          }
        } catch (error) {
          console.error('Error fetching training progress:', error);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTraining, addToConsoleLog]);

  const handleStartTraining = async () => {
    try {
      const response = await fetch('/api/start-training', { method: 'POST' });
      if (response.ok) {
        setIsTraining(true);
        setTrainingProgress(0);
        setElapsedTime(0);
        setTimeLeft(100); // Assuming 100 seconds for training
        setTrainingActivities([]);
        setKnowledgeLevel(0);
        addToConsoleLog('Training started');
      } else {
        addToConsoleLog('Failed to start training');
      }
    } catch (error) {
      console.error('Error starting training:', error);
      addToConsoleLog('Error starting training');
    }
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
      className="fixed inset-0 bg-gray-900/95 text-white overflow-hidden z-45"
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

          <BrainModel knowledgeLevel={knowledgeLevel} />

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
