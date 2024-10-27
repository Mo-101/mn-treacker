import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Leaf,
  Layers
} from 'lucide-react';

export const defaultLayers = [
  {
    id: 'satellite',
    name: 'Satellite Hybrid HD',
    icon: <Layers className="h-5 w-5" />,
    default: true
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: <Thermometer className="h-5 w-5" />
  },
  {
    id: 'vegetation',
    name: 'Vegetation',
    icon: <Leaf className="h-5 w-5" />
  },
  {
    id: 'soil-moisture',
    name: 'Soil Moisture',
    icon: <Droplets className="h-5 w-5" />
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    icon: <Cloud className="h-5 w-5" />
  },
  {
    id: 'wind',
    name: 'Wind Speed',
    icon: <Wind className="h-5 w-5" />
  }
];