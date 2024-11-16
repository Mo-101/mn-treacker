import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const ModelPerformanceDashboard = () => {
  const { data: ratLocations, isLoading: isLoadingRats } = useQuery({
    queryKey: ['ratLocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rat_locations')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: lfData, isLoading: isLoadingLF } = useQuery({
    queryKey: ['lfData'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lf_data')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  if (isLoadingRats || isLoadingLF) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const locationData = ratLocations?.map(loc => ({
    name: loc.locality_community,
    value: 1,
    latitude: loc.latitude,
    longitude: loc.longitude
  })) || [];

  const lfCaseData = lfData?.map(lf => ({
    name: lf.city,
    cases: 1,
    latitude: lf.latitude,
    longitude: lf.longitude
  })) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gray-800/50 border-cyan-500/30 border">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">Rat Detection Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-cyan-500/30 border">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-400">Lassa Fever Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lfCaseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="cases" stroke="#22d3ee" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelPerformanceDashboard;