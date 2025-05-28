import React from 'react';
import { Property } from '../../types/property';
import { PropertyCard } from '../properties/PropertyCard';

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, loading }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Properties in Selected Area</h2>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-gray-600">Searching for properties...</p>
        </div>
      ) : properties.length > 0 ? (
        <div className="space-y-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No properties found in this area.</p>
          <p className="text-gray-500 text-sm mt-2">Try drawing a different polygon.</p>
        </div>
      )}
    </div>
  );
};

export default PropertyList; 