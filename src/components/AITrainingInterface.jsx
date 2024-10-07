import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BarChart2, Map, Settings, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import TopNavigationBar from './AITrainingComponents/TopNavigationBar';
import DataUploadSection from './AITrainingComponents/DataUploadSection';
import ModelPerformanceDashboard from './AITrainingComponents/ModelPerformanceDashboard';
import DataVisualizationPanel from './AITrainingComponents/DataVisualizationPanel';
import TrainingControlsPanel from './AITrainingComponents/TrainingControlsPanel';
import InteractiveSidebar from './AITrainingComponents/InteractiveSidebar';
import BottomConsole from './AITrainingComponents/BottomConsole';
import HelpSection from './AITrainingComponents/HelpSection';

const AITrainingInterface = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('upload');
  const [showHelp, setShowHelp] = useState(false);

  const navItems = [
    { icon: Upload, label: 'Upload', section: 'upload' },
    { icon: BarChart2, label: 'Performance', section: 'performance' },
    { icon: Map, label: 'Visualization', section: 'visualization' },
    { icon: Settings, label: 'Settings', section: 'settings' },
  ];

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
                <DataUploadSection />
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
                <Card>
                  <CardContent>
                    <h2 className="text-xl font-bold mb-4">Settings</h2>
                    {/* Add settings controls here */}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <TrainingControlsPanel />
        </div>
      </div>

      <BottomConsole />

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