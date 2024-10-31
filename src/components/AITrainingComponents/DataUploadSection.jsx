import React, { useState } from 'react';
import { Upload, Link, Database } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Card, CardContent } from '../ui/card';

const DataUploadSection = ({ onUploadComplete }) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onUploadComplete) {
            onUploadComplete();
          }
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Data Upload</h2>
        <div className="space-y-4">
          <div>
            <Input placeholder="Enter data source URL" className="mb-2 border-yellow-400/50 text-yellow-400 placeholder:text-yellow-400/50" />
            <Button onClick={simulateUpload} className="w-full bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30">
              <Link className="h-4 w-4 mr-2" />
              Upload from URL
            </Button>
          </div>
          <div>
            <Input type="file" className="mb-2 border-yellow-400/50 text-yellow-400" />
            <Button onClick={simulateUpload} className="w-full bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30">
              <Upload className="h-4 w-4 mr-2" />
              Upload Local Files
            </Button>
          </div>
          <Button onClick={simulateUpload} className="w-full bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30">
            <Database className="h-4 w-4 mr-2" />
            Connect to API
          </Button>
          {uploadProgress > 0 && (
            <div>
              <Progress value={uploadProgress} className="mb-2 bg-yellow-400/20 [&>div]:bg-yellow-400" />
              <p className="text-sm text-yellow-400">Upload Progress: {uploadProgress}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataUploadSection;