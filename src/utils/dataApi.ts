import { useQuery } from '@tanstack/react-query';
import { useToast } from '../components/ui/use-toast';

interface Detection {
  id: string;
  coordinates: [number, number];
  confidence: number;
  timestamp: string;
  species: string;
  details: string;
  habitat: string;
  behavior: string;
}

interface LassaCase {
  id: string;
  latitude: number;
  longitude: number;
  severity: 'high' | 'medium' | 'low';
  date: string;
  location: string;
}

export const useRatDetections = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['ratDetections'],
    queryFn: async (): Promise<Detection[]> => {
      const response = await fetch('/api/rat-locations');
      if (!response.ok) {
        throw new Error('Failed to fetch rat detection data');
      }
      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Error fetching detection data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  });
};

export const useLassaCases = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['lassaCases'],
    queryFn: async (): Promise<LassaCase[]> => {
      const response = await fetch('/api/cases');
      if (!response.ok) {
        throw new Error('Failed to fetch Lassa fever cases');
      }
      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Error fetching Lassa fever cases",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  });
};