import React from 'react';
import { DollarSign, MapPin, Ruler } from 'lucide-react';

interface PredictionBreakdownProps {
  breakdown: {
    basePrice: number;
    locationFactor: number;
    sizeFactor: number;
    amenitiesFactor: number;
    macroeconomicFactor: number;
  };
  similarProperties: Array<{
    id: string;
    address: string;
    price: number;
    surface: number;
    distance: number;
  }>;
}

const PredictionBreakdown: React.FC<PredictionBreakdownProps> = ({ breakdown, similarProperties }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  
  const getPercentage = (value: number) => {
    return Math.round((value / total) * 100);
  };

  const factors = [
    { key: 'basePrice', label: 'Base Property Value', color: 'bg-blue-900' },
    { key: 'locationFactor', label: 'Location Premium', color: 'bg-teal-600' },
    { key: 'sizeFactor', label: 'Size & Layout', color: 'bg-indigo-600' },
    { key: 'amenitiesFactor', label: 'Nearby Amenities', color: 'bg-green-600' },
    { key: 'macroeconomicFactor', label: 'Market Conditions', color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Composition</h3>
      
      {/* Price Bar Chart */}
      <div className="mb-8">
        <div className="h-8 flex rounded-md overflow-hidden mb-3">
          {factors.map((factor) => (
            <div 
              key={factor.key} 
              className={`${factor.color} h-full`} 
              style={{ width: `${getPercentage(breakdown[factor.key as keyof typeof breakdown])}%` }}
            ></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {factors.map((factor) => (
            <div key={factor.key} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${factor.color} mr-2`}></div>
              <div className="flex justify-between items-center w-full">
                <span className="text-sm text-gray-700">{factor.label}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(breakdown[factor.key as keyof typeof breakdown])}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Similar Properties */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparable Properties</h3>
        
        <div className="space-y-4">
          {similarProperties.map((property) => (
            <div key={property.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                  <span className="text-gray-900 font-medium">{property.address}</span>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {property.distance} miles away
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-700">
                  <Ruler className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">{property.surface} sqft</span>
                </div>
                <div className="flex items-center text-gray-900 font-semibold">
                  <DollarSign className="h-4 w-4 mr-0.5 text-blue-900" />
                  <span>{formatCurrency(property.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionBreakdown;