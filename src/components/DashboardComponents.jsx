import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Calendar } from "./ui/calendar";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardComponents = () => {
  const lineChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
  ];

  const barChartData = [
    { name: 'A', value: 20 },
    { name: 'B', value: 35 },
    { name: 'C', value: 15 },
    { name: 'D', value: 40 },
    { name: 'E', value: 30 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-100">
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">23</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">New Users</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">56</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Active Sessions</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">84%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Engagement Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Line Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Calendar */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={75} className="w-full" />
              <p className="text-sm text-gray-500">75% Complete</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar className="rounded-md border" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardComponents;