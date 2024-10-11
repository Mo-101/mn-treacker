import React, { useState } from 'react';
import { Upload, Link, Database } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Card, CardContent } from '../ui/card';

const DataUploadSection = ({ onUploadComplete }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onUploadComplete();
        alert('File uploaded successfully!');
      } else {
        alert('File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Data Upload</h2>
        <div className="space-y-4">
          <div>
            <Input type="file" onChange={handleFileChange} className="mb-2" />
            <Button onClick={uploadFile} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
          </div>
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