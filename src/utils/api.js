import { toast } from '../components/ui/use-toast';
import { mockRatLocations, mockLassaCases } from './mockData';

export const fetchEnvironmentalData = async () => {
  return {
    populationTrend: [
      { month: 'Jan', actual: 4000, predicted: 4400 },
      { month: 'Feb', actual: 3000, predicted: 3200 },
      { month: 'Mar', actual: 2000, predicted: 2400 },
      { month: 'Apr', actual: 2780, predicted: 2900 },
      { month: 'May', actual: 1890, predicted: 2100 },
      { month: 'Jun', actual: 2390, predicted: 2500 }
    ],
    habitatSuitability: [
      { area: 'Forest', suitability: 80 },
      { area: 'Grassland', suitability: 65 },
      { area: 'Urban', suitability: 30 },
      { area: 'Wetland', suitability: 75 }
    ]
  };
};

export const fetchRatData = () => Promise.resolve(mockRatLocations);
export const fetchLassaFeverCases = () => Promise.resolve(mockLassaCases);