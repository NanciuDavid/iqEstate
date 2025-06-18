import React from 'react';
import { Property } from '../../types/property';
import { PropertyCard } from '../properties/PropertyCard';

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
  error?: string | null;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, loading, error }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Properties in Selected Area</h2>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-gray-600">Searching for properties...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Search Error</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
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