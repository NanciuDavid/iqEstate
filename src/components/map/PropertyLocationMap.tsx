import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure default marker icon
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PropertyLocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  price: number;
  currency?: string;
  className?: string;
}

const PropertyLocationMap: React.FC<PropertyLocationMapProps> = ({
  latitude,
  longitude,
  title,
  address,
  price,
  currency = 'EUR',
  className = ''
}) => {
  const mapRef = useRef<L.Map | null>(null);

  // Custom property marker icon
  const propertyIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#f59e0b" stroke="#ffffff" stroke-width="3"/>
        <path d="M16 10l3 6h-6l3-6z" fill="#ffffff"/>
        <rect x="13" y="16" width="6" height="4" fill="#ffffff"/>
        <rect x="14" y="18" width="1" height="2" fill="#f59e0b"/>
        <rect x="17" y="18" width="1" height="2" fill="#f59e0b"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });

  const formatPrice = (price: number): string => {
    const symbol = currency === 'EUR' ? '€' : currency === 'RON' ? 'RON' : '$';
    return `${symbol}${price.toLocaleString()}`;
  };

  useEffect(() => {
    // Invalidate map size when component mounts or updates
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [latitude, longitude]);

  // Handle invalid coordinates
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center h-96 ${className}`}>
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-sm">Location not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 shadow-md ${className}`}>
      <MapContainer 
        center={[latitude, longitude]} 
        zoom={15} 
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker 
          position={[latitude, longitude]}
          icon={propertyIcon}
        >
          <Popup 
            className="property-popup"
            maxWidth={250}
            closeButton={false}
          >
            <div className="p-2">
              <h3 className="font-semibold text-amber-700 text-sm mb-1 line-clamp-2">
                {title}
              </h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {address}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-600">
                  {formatPrice(price)}
                </span>
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyLocationMap; 