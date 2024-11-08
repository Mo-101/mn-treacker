const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const weatherLayers = [
  {
    id: 'temperature',
    name: 'Temperature',
    url: 'mapbox://styles/akanimo1/cld5h233p000q01qat06k4qw7',
    type: 'style',
    opacity: 0.8,
    colorRamp: [
      { temp: -20, color: '#0000FF' },
      { temp: -10, color: '#4169E1' },
      { temp: 0, color: '#87CEEB' },
      { temp: 10, color: '#90EE90' },
      { temp: 20, color: '#FFFF00' },
      { temp: 30, color: '#FFA500' },
      { temp: 40, color: '#FF4500' },
      { temp: 50, color: '#FF0000' }
    ]
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.8
  },
  {
    id: 'clouds',
    name: 'Clouds',
    url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.6
  },
  {
    id: 'wind',
    name: 'Wind',
    url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    opacity: 0.7
  }
];

export const getTemperatureColor = (temp) => {
  const layer = weatherLayers.find(l => l.id === 'temperature');
  const ramp = layer.colorRamp;
  
  // Handle edge cases
  if (temp <= ramp[0].temp) return ramp[0].color;
  if (temp >= ramp[ramp.length - 1].temp) return ramp[ramp.length - 1].color;
  
  // Find the two colors to interpolate between
  for (let i = 0; i < ramp.length - 1; i++) {
    if (temp >= ramp[i].temp && temp <= ramp[i + 1].temp) {
      const ratio = (temp - ramp[i].temp) / (ramp[i + 1].temp - ramp[i].temp);
      return interpolateColor(ramp[i].color, ramp[i + 1].color, ratio);
    }
  }
  return ramp[0].color;
};

const interpolateColor = (color1, color2, ratio) => {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};