import React, { useState } from 'react';
import { Upload, Link, Database } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Progress } from '../../../components/ui/progress';
import { Card, CardContent } from '../../../components/ui/card';

const DataUploadSection = ({ onUploadComplete }) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onUploadComplete();
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Data Upload</h2>
        <div className="space-y-4">
          <div>
            <Input placeholder="Enter data source URL" className="mb-2" />
            <Button onClick={simulateUpload} className="w-full">
              <Link className="h-4 w-4 mr-2" />
              Upload from URL
            </Button>
          </div>
          <div>
            <Input type="file" className="mb-2" />
            <Button onClick={simulateUpload} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Local Files
            </Button>
          </div>
          <Button onClick={simulateUpload} className="w-full">
            <Database className="h-4 w-4 mr-2" />
            Connect to API
          </Button>
          {uploadProgress > 0 && (
            <div>
              <Progress value={uploadProgress} className="mb-2" />
              <p className="text-sm text-gray-300">Upload Progress: {uploadProgress}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataUploadSection;