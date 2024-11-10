import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

const DetectionMap = ({ detections }) => {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup>
          {detections.map((detection, index) => (
            <Marker
              key={index}
              position={detection.coordinates}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">Detection #{detection.id}</h3>
                  <p>Confidence: {detection.confidence}%</p>
                  <p>Time: {detection.timestamp}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default DetectionMap;