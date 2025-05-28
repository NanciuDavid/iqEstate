import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SimpleMapComponent: React.FC = () => {
  return (
    <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200 shadow-md">
      <MapContainer 
        center={[40.7128, -74.006]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default SimpleMapComponent; 