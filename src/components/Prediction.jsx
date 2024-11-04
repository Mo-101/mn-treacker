import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ChartLine, MapPin, Battery, UserCheck, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchEnvironmentalData } from '../utils/api';
import { useToast } from './ui/use-toast';

const Prediction = () => {
  const { toast } = useToast();
  const { data: environmentalData, isError } = useQuery({
    queryKey: ['environmental-data'],
    queryFn: fetchEnvironmentalData,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch prediction data. Using fallback data.",
        variant: "destructive",
      });
    }
  });

  const predictionData = environmentalData?.populationTrend || [
    { month: 'Jan', actual: 4000, predicted: 4400 },
    { month: 'Feb', actual: 3000, predicted: 3200 },
    { month: 'Mar', actual: 2000, predicted: 2400 },
    { month: 'Apr', actual: 2780, predicted: 2900 },
    { month: 'May', actual: 1890, predicted: 2100 },
    { month: 'Jun', actual: 2390, predicted: 2500 },
  ];

  const habitatData = environmentalData?.habitatSuitability || [
    { area: 'Forest', suitability: 80 },
    { area: 'Grassland', suitability: 65 },
    { area: 'Urban', suitability: 30 },
    { area: 'Wetland', suitability: 75 },
  ];

  const getConfidenceColor = (value) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskLevel = (value) => {
    if (value >= 80) return { icon: Battery, color: 'text-red-500', text: 'High Risk' };
    if (value >= 60) return { icon: Battery, color: 'text-yellow-500', text: 'Medium Risk' };
    return { icon: Battery, color: 'text-green-500', text: 'Low Risk' };
  };

  return (
    <div className="prediction bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
        <Activity className="h-8 w-8 text-cyan-400" />
        Mastomys Natalensis Prediction
      </h2>
      <p className="mb-4">This section provides predictions and early warnings for potential Mastomys natalensis colonies based on environmental factors.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-cyan-500 border">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400 flex items-center gap-2">
              <ChartLine className="h-6 w-6 text-cyan-400" />
              Population Trend Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-cyan-500 border">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-cyan-400" />
              Habitat Suitability Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={habitatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="area" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                <Bar 
                  dataKey="suitability" 
                  fill="#82ca9d"
                  label={({ value }) => (
                    <text 
                      x={0} 
                      y={0} 
                      dy={-10} 
                      className={getConfidenceColor(value)}
                      textAnchor="middle"
                    >
                      {value}%
                    </text>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-cyan-500 border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400 flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-cyan-400" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {habitatData.map((habitat) => {
                const risk = getRiskLevel(habitat.suitability);
                const RiskIcon = risk.icon;
                return (
                  <div key={habitat.area} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">{habitat.area}</span>
                      <RiskIcon className={`h-5 w-5 ${risk.color}`} />
                    </div>
                    <div className={`text-lg font-bold ${risk.color}`}>
                      {risk.text}
                    </div>
                    <div className="text-sm text-gray-400">
                      Confidence: {habitat.suitability}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Prediction;