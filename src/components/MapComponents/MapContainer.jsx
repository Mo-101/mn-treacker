import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { initializeMap } from '../../utils/mapUtils';
import DetectionSpotLayer from '../DetectionSpotLayer';
import LassaFeverCasesLayer from '../LassaFeverCasesLayer';
import WindParticleLayer from '../WindParticleLayer';
import WindGLLayer from '../WindGLLayer';

const MapContainer = ({ ratLocations, lassaCases, activeLayers, layerOpacity }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = initializeMap(mapContainer.current, {
      lng: 27.12657,
      lat: 3.46732,
      zoom: 2
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div ref={mapContainer} className="absolute inset-0 w-full h-full">
      {map.current && (
        <>
          <WindParticleLayer map={map.current} />
          <WindGLLayer map={map.current} />
          <DetectionSpotLayer map={map.current} detections={ratLocations} />
          <LassaFeverCasesLayer map={map.current} cases={lassaCases} />
        </>
      )}
    </div>
  );
};

export default MapContainer;