import React from 'react';
import { X, MapPin, Home } from 'lucide-react';

interface SimilarProperty {
  address: string;
  surface: number;
  price: number;
  distance: number;
}

interface SimilarPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  surface: number;
  similarProperties: SimilarProperty[];
}

const SimilarPropertiesModal: React.FC<SimilarPropertiesModalProps> = ({
  isOpen,
  onClose,
  location,
  surface,
  similarProperties
}) => {
  if (!isOpen) return null;

  const averagePricePerSqm = similarProperties.length > 0
    ? similarProperties.reduce((acc, prop) => acc + (prop.price / prop.surface), 0) / similarProperties.length
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Similar Properties Nearby</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{location.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Home className="h-4 w-4 mr-1.5" />
              <span>{surface} sqm</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Average Price per sqm</span>
              <span className="text-xl font-bold text-blue-900">
                ${averagePricePerSqm.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Based on {similarProperties.length} similar properties in your area
            </p>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {similarProperties.map((property, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-gray-900 font-medium">{property.address}</p>
                      <p className="text-sm text-gray-500">{property.distance.toFixed(1)} km away</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-blue-900">
                      ${property.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${(property.price / property.surface).toFixed(2)}/sqm
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Home className="h-4 w-4 mr-1.5" />
                  <span>{property.surface} sqm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            These prices are based on recent transactions and listings in your area. 
            Actual property values may vary based on specific conditions and features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimilarPropertiesModal;