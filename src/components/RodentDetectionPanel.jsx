import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Search, ChevronDown, ChevronUp, AlertTriangle, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';
import { format } from 'date-fns';
import DetectionMap from './DetectionMap';
import DetectionTimeSeries from './DetectionTimeSeries';

const RodentDetectionPanel = ({ isOpen, onToggle, detections = [] }) => {
  const [expandedDetection, setExpandedDetection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleDownloadReport = () => {
    // CSV export logic would go here
    toast({
      title: "Report downloaded",
      description: "Your report has been downloaded successfully.",
    });
  };

  const getSeverityColor = (confidence) => {
    if (confidence > 80) return 'bg-red-500';
    if (confidence > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss');
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-96 bg-black/70 backdrop-blur-lg text-yellow-400 p-4 overflow-y-auto"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-black/70"
      >
        {isOpen ? <ChevronRight /> : <ChevronLeft />}
      </Button>

      <CardHeader>
        <CardTitle className="text-2xl font-bold text-yellow-400">Real-Time Detection Feed</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Input
            type="file"
            accept=".csv,.geojson"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button onClick={() => document.getElementById('file-upload').click()} className="flex-1 text-yellow-400">
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </Button>
          <Button onClick={handleDownloadReport} variant="outline" className="flex-1 text-yellow-400">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        <Input
          placeholder="Search detections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/20 border-none text-yellow-400 placeholder-yellow-400/50"
        />

        {Array.isArray(detections) && detections.length > 0 ? (
          <div className="space-y-2">
            {detections.map((detection, index) => (
              <Card key={index} className="bg-white/10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-bold text-yellow-400">ID: #{detection.id}</p>
                      <p className="text-sm text-yellow-400/80">
                        {detection.timestamp ? formatTimestamp(detection.timestamp) : 'No timestamp'}
                      </p>
                    </div>
                    {detection.confidence && (
                      <div 
                        className={`${getSeverityColor(detection.confidence)} w-3 h-3 rounded-full`} 
                        title={`Confidence: ${detection.confidence}%`} 
                      />
                    )}
                  </div>

                  {detection.confidence && (
                    <Progress 
                      value={detection.confidence} 
                      className="mt-2"
                      indicatorClassName={getSeverityColor(detection.confidence)}
                    />
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full text-yellow-400"
                    onClick={() => setExpandedDetection(expandedDetection === index ? null : index)}
                  >
                    {expandedDetection === index ? <ChevronUp /> : <ChevronDown />}
                    {expandedDetection === index ? 'Less' : 'More'} Details
                  </Button>

                  {expandedDetection === index && (
                    <div className="mt-2 space-y-2 bg-black/20 p-2 rounded text-yellow-400">
                      <p>Location: {detection.location || 'N/A'}</p>
                      <p>Coordinates: {detection.coordinates ? detection.coordinates.join(', ') : 'N/A'}</p>
                      <p>Environmental Data: {detection.environmentalData || 'N/A'}</p>
                      {detection.confidence > 80 && (
                        <div className="flex items-center text-red-400">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          High Risk Area
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-yellow-400/60">No detections found</p>
        )}
      </CardContent>
    </motion.div>
  );
};

export default RodentDetectionPanel;
