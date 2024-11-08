import mapboxgl from 'mapbox-gl';
import { processWeatherData } from '../utils/weatherDataUtils';
import { toast } from '../components/ui/use-toast';

const addLayer = (map, id, source, type, paint, layout = {}) => {
  if (map.getSource(id)) {
    map.removeSource(id);
  }
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
  
  map.addSource(id, source);
  map.addLayer({
    id,
    type,
    source: id,
    paint,
    layout: { visibility: 'visible', ...layout }
  });
};

export const addCustomLayers = async (map) => {
  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  try {
    const response = await fetch('/weather_data');
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const weatherData = await response.json();

    weatherData.layers.forEach(layer => {
      addLayer(map, layer.id, {
        type: 'raster',
        tiles: [`https://tile.openweathermap.org/map/${layer.id}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
        tileSize: 256
      }, 'raster', {
        'raster-opacity': 0.8,
        'raster-resampling': 'linear'
      });
    });

    toast({
      title: "Success",
      description: "Weather layers loaded successfully",
    });

  } catch (error) {
    console.error('Error loading weather layers:', error);
    toast({
      title: "Error",
      description: "Failed to load weather layers. Using fallback data.",
      variant: "destructive",
    });

    // Fallback layers
    const fallbackLayers = ['temp_new', 'precipitation_new', 'clouds_new', 'wind_new'];
    fallbackLayers.forEach(layerId => {
      addLayer(map, layerId, {
        type: 'raster',
        tiles: [`https://tile.openweathermap.org/map/${layerId}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`],
        tileSize: 256
      }, 'raster', {
        'raster-opacity': 0.8,
        'raster-resampling': 'linear'
      });
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

const addPrecipitationLayer = (map) => {
  addLayer(map, 'precipitation', {
    type: 'raster',
    url: 'mapbox://mapbox.precipitation'
  }, 'raster', { 'raster-opacity': 0.7 });
};

const addCloudsLayer = (map) => {
  addLayer(map, 'clouds', {
    type: 'raster',
    url: 'mapbox://mapbox.satellite'
  }, 'raster', { 'raster-opacity': 0.5 });
};

const addRadarLayer = (map) => {
  addLayer(map, 'radar', {
    type: 'raster',
    url: 'mapbox://mapbox.radar'
  }, 'raster', { 'raster-opacity': 0.7 });
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
