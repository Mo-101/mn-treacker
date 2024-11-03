import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const predictionData = [
  { month: 'Jan', actual: 4000, predicted: 4400 },
  { month: 'Feb', actual: 3000, predicted: 3200 },
  { month: 'Mar', actual: 2000, predicted: 2400 },
  { month: 'Apr', actual: 2780, predicted: 2900 },
  { month: 'May', actual: 1890, predicted: 2100 },
  { month: 'Jun', actual: 2390, predicted: 2500 },
];

const habitatData = [
  { area: 'Forest', suitability: 80 },
  { area: 'Grassland', suitability: 65 },
  { area: 'Urban', suitability: 30 },
  { area: 'Wetland', suitability: 75 },
];

const Prediction = () => {
  return (
    <div className="prediction bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">Mastomys Natalensis Prediction</h2>
      <p className="mb-4">This section provides predictions and early warnings for potential Mastomys natalensis colonies based on environmental factors.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-cyan-500 border">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400">Population Trend Prediction</CardTitle>
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
            <CardTitle className="text-xl text-cyan-400">Habitat Suitability Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={habitatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="area" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                <Bar dataKey="suitability" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-cyan-500 border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400">Environmental Impact Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                <Area type="monotone" dataKey="actual" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="predicted" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Prediction;