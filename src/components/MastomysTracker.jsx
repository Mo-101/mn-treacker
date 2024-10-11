import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const MastomysTracker = ({ data, map }) => {
  const [markersAdded, setMarkersAdded] = useState(false);

  useEffect(() => {
    if (!map || data.length === 0 || markersAdded) return;

    const markers = [];

    data.forEach((point) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = 'red';
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.borderRadius = '50%';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([point.lng, point.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>Mastomys Population: ${point.population}</h3>`)
        )
        .addTo(map);

      markers.push(marker);
    });

    setMarkersAdded(true);

    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [map, data, markersAdded]);

  return null;
};

export default MastomysTracker;