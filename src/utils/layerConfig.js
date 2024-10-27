import { Cloud, Droplets, Wind, Thermometer, Leaf, Layers } from 'lucide-react';

export const defaultLayers = [
  {
    id: 'satellite',
    name: 'Satellite Hybrid HD',
    icon: Layers,
    default: true
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: Thermometer
  },
  {
    id: 'vegetation',
    name: 'Vegetation',
    icon: Leaf
  },
  {
    id: 'soil-moisture',
    name: 'Soil Moisture',
    icon: Droplets
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    icon: Cloud
  },
  {
    id: 'wind',
    name: 'Wind Speed',
    icon: Wind
  }
];