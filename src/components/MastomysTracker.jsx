import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const MastomysTracker = ({ data, map }) => {
  const [markersAdded, setMarkersAdded] = useState(false);

  useEffect(() => {
    if (!map || !data || data.length === 0 || markersAdded) return;

    data.forEach((point) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = 'red';
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.borderRadius = '50%';

      new mapboxgl.Marker(el)
        .setLngLat([point.lng, point.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>Mastomys Population: ${point.population}</h3>`)
        )
        .addTo(map);
    });

    setMarkersAdded(true);
  }, [map, data, markersAdded]);

  return null; // This component doesn't render anything directly
};

export default MastomysTracker;