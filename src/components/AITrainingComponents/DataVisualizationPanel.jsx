import React from 'react';
import { Card, CardContent } from '../ui/card';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';

const DataVisualizationPanel = ({ ratLocations, lassaFeverCases, weatherData }) => {
  React.useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [8.6753, 9.0820], // Nigeria's approximate center
      zoom: 5
    });

    map.on('load', () => {
      if (ratLocations) {
        map.addSource('rat-locations', {
          type: 'geojson',
          data: ratLocations
        });

        map.addLayer({
          id: 'rat-points',
          type: 'circle',
          source: 'rat-locations',
          paint: {
            'circle-radius': 4,
            'circle-color': '#ff0000'
          }
        });
      }

      if (lassaFeverCases) {
        map.addSource('lassa-fever-cases', {
          type: 'geojson',
          data: lassaFeverCases
        });

        map.addLayer({
          id: 'lassa-fever-points',
          type: 'circle',
          source: 'lassa-fever-cases',
          paint: {
            'circle-radius': 4,
            'circle-color': '#00ff00'
          }
        });
      }
    });

    return () => map.remove();
  }, [ratLocations, lassaFeverCases]);

  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Data Visualization</h2>
        <div id="map" style={{ width: '100%', height: '400px' }} />
        {weatherData && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Current Weather</h3>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataVisualizationPanel;