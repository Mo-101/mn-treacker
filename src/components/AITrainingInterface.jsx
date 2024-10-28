import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BarChart2, Map, Settings, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from "./ui/use-toast";
import TopNavigationBar from './AITrainingComponents/TopNavigationBar';
import DataUploadSection from './AITrainingComponents/DataUploadSection';
import ModelPerformanceDashboard from './AITrainingComponents/ModelPerformanceDashboard';
import InteractiveSidebar from './AITrainingComponents/InteractiveSidebar';
import HelpSection from './AITrainingComponents/HelpSection';
import BrainModel from './AITrainingComponents/BrainModel';
import TrainingControlsPanel from './AITrainingComponents/TrainingControlsPanel';

const AITrainingInterface = ({ isOpen, onClose, addToConsoleLog }) => {
  const [activeSection, setActiveSection] = useState('upload');
  const [showHelp, setShowHelp] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [dataUploaded, setDataUploaded] = useState(false);
  const [trainingActivities, setTrainingActivities] = useState([]);
  const { toast } = useToast();

  const startTraining = async () => {
    if (!dataUploaded) {
      toast({
        title: "Error",
        description: "Please upload data before starting training",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsTraining(true);
      const response = await fetch('/api/start-training', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start training');
      }

      addToConsoleLog('Training started successfully');
      pollTrainingProgress();
    } catch (error) {
      console.error('Error starting training:', error);
      toast({
        title: "Error",
        description: "Failed to start training. Please try again.",
        variant: "destructive",
      });
      setIsTraining(false);
    }
  };

  const pollTrainingProgress = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/training-progress');
        const data = await response.json();
        
        setTrainingProgress(data.progress);
        if (data.progress === 100 || !data.is_training) {
          clearInterval(interval);
          setIsTraining(false);
          addToConsoleLog('Training completed');
          toast({
            title: "Success",
            description: "Training completed successfully!",
          });
        }
      } catch (error) {
        console.error('Error fetching training progress:', error);
        clearInterval(interval);
        setIsTraining(false);
      }
    }, 1000);
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
        navItems={[
          { icon: Upload, label: 'Upload', section: 'upload' },
          { icon: BarChart2, label: 'Performance', section: 'performance' },
          { icon: Map, label: 'Visualization', section: 'visualization' },
          { icon: Settings, label: 'Settings', section: 'settings' }
        ]}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onClose={onClose}
      />

      <div className="flex-grow flex overflow-hidden">
        <InteractiveSidebar />

        <div className="flex-grow overflow-auto p-4 space-y-4">
          <AnimatePresence mode="wait">
            {activeSection === 'upload' && (
              <DataUploadSection onUploadComplete={handleDataUpload} />
            )}
            {activeSection === 'performance' && (
              <ModelPerformanceDashboard />
            )}
          </AnimatePresence>

          <BrainModel knowledgeLevel={trainingProgress} />

          <TrainingControlsPanel 
            onStartTraining={startTraining}
            isTraining={isTraining}
            trainingProgress={trainingProgress}
            dataUploaded={dataUploaded}
            trainingActivities={trainingActivities}
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