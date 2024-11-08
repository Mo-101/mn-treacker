import mapboxgl from 'mapbox-gl';
import { weatherLayers } from '../utils/weatherLayerConfig';
import { addWeatherLayer, toggleWeatherLayer, updateLayerOpacity } from '../utils/weatherLayerManager';
import { toast } from './ui/use-toast';

export const addCustomLayers = async (map) => {
  try {
    weatherLayers.forEach(layer => {
      addWeatherLayer(map, layer.id);
    });

    toast({
      title: "Success",
      description: "Weather layers loaded successfully",
    });
  } catch (error) {
    console.error('Error loading weather layers:', error);
    toast({
      title: "Error",
      description: "Failed to load weather layers",
      variant: "destructive",
    });
  }
};

const addHistoricalWeatherLayer = async (map) => {
  try {
    const response = await fetch('/data/weather_data.geojson');
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const weatherData = await response.json();
    const processedData = processWeatherData(weatherData);

    addLayer(map, 'historical-weather', {
      type: 'geojson',
      data: processedData
    }, 'circle', {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'temperature'],
        0, 4,
        30, 12
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'temperature'],
        0, '#0000FF',
        15, '#FFFF00',
        30, '#FF0000'
      ],
      'circle-opacity': 0.7,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#FFFFFF'
    });

    // Add popup for weather data points
    map.on('click', 'historical-weather', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      const date = new Date(properties.timestamp).toLocaleDateString();

      const description = `
        <div class="p-2">
          <h3 class="font-bold mb-2">Weather Data (${date})</h3>
          <p>Temperature: ${properties.temperature}°C</p>
          <p>Precipitation: ${properties.precipitation}mm</p>
          <p>Humidity: ${properties.humidity}%</p>
          <p>Wind Speed: ${properties.windSpeed}m/s</p>
        </div>
      `;

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

  } catch (error) {
    console.error('Error loading historical weather data:', error);
    toast({
      title: "Error",
      description: "Failed to load historical weather data. Using fallback data.",
      variant: "destructive",
    });
  }
};

const addVegetationLayer = (map) => {
  addLayer(map, 'vegetation', {
    type: 'raster',
    url: 'mapbox://mapbox.satellite',
    tileSize: 256
  }, 'raster', { 
    'raster-opacity': 0.7,
    'raster-saturation': 0.5,
    'raster-hue-rotate': 90, // Adjust hue to emphasize vegetation
    'raster-brightness-min': 0.2
  });
};

const addAdminBoundariesLayer = (map) => {
  if (!map.getSource('admin-boundaries')) {
    map.addSource('admin-boundaries', {
      type: 'vector',
      url: 'mapbox://mapbox.boundaries-adm0-v3,mapbox.boundaries-adm1-v3,mapbox.boundaries-adm2-v3'
    });
  }

  // Add country boundaries
  if (!map.getLayer('admin-boundaries-country')) {
    map.addLayer({
      id: 'admin-boundaries-country',
      type: 'line',
      source: 'admin-boundaries',
      'source-layer': 'boundaries_admin_0',
      paint: {
        'line-color': '#FFD700',  // Gold color for country boundaries
        'line-width': 2,
        'line-opacity': 0.8
      },
      layout: { visibility: 'visible' }
    });
  }

  // Add state/province boundaries
  if (!map.getLayer('admin-boundaries-state')) {
    map.addLayer({
      id: 'admin-boundaries-state',
      type: 'line',
      source: 'admin-boundaries',
      'source-layer': 'boundaries_admin_1',
      paint: {
        'line-color': '#FFA500',  // Orange color for state boundaries
        'line-width': 1,
        'line-opacity': 0.6
      },
      layout: { visibility: 'visible' }
    });
  }

  // Add district/county boundaries
  if (!map.getLayer('admin-boundaries-district')) {
    map.addLayer({
      id: 'admin-boundaries-district',
      type: 'line',
      source: 'admin-boundaries',
      'source-layer': 'boundaries_admin_2',
      paint: {
        'line-color': '#FFE4B5',  // Moccasin color for district boundaries
        'line-width': 0.5,
        'line-opacity': 0.4
      },
      layout: { visibility: 'visible' }
    });
  }
};

export { addHistoricalWeatherLayer, addVegetationLayer, addAdminBoundariesLayer };
