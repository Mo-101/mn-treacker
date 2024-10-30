import React from 'react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from '../ui/tooltip';
import { Info } from 'lucide-react';

const ModelPerformanceDashboard = () => {
  const [learningRate, setLearningRate] = React.useState(0.001);
  const [batchSize, setBatchSize] = React.useState(32);
  const [progress, setProgress] = React.useState(45);

  return (
    <Card className="bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md border-yellow-400/20 p-6 space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400 tracking-tight">Model Performance</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg text-yellow-400">Training Progress</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-yellow-400/60" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current training progress of the model</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Progress value={progress} className="h-2 bg-yellow-400/20 [&_div]:bg-yellow-400" />
          <p className="text-sm text-yellow-400/80">{progress}% Complete</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg text-yellow-400">Learning Rate</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-yellow-400/60" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Higher rates may speed up learning but risk overshooting</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-yellow-400">{learningRate}</span>
          </div>
          <Slider
            value={[learningRate * 1000]}
            onValueChange={(value) => setLearningRate(value[0] / 1000)}
            max={10}
            step={0.1}
            className="[&_.relative]:bg-yellow-400/20 [&_[role=slider]]:bg-yellow-400 [&_[role=slider]]:border-yellow-400 [&_.absolute]:bg-yellow-400"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg text-yellow-400">Batch Size</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-yellow-400/60" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Larger batches may improve stability but use more memory</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-yellow-400">{batchSize}</span>
          </div>
          <Slider
            value={[batchSize]}
            onValueChange={(value) => setBatchSize(value[0])}
            max={128}
            step={8}
            className="[&_.relative]:bg-yellow-400/20 [&_[role=slider]]:bg-yellow-400 [&_[role=slider]]:border-yellow-400 [&_.absolute]:bg-yellow-400"
          />
        </div>
      </div>
    </Card>
  );
};

export default ModelPerformanceDashboard;