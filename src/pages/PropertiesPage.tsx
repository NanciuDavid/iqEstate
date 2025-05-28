import React, { useEffect, useState } from 'react';
import { PropertyCard } from '../components/properties/PropertyCard';
import PropertyFilters, { FilterState } from '../components/properties/PropertyFilters';
import { mockProperties } from '../data/mockdata';
import { Property } from '../types/property';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertiesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [properties] = useState<Property[]>(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);

  // Apply filters to the properties
  const handleFilterChange = (filters: FilterState) => {
    const filtered = properties.filter(property => {
      // Filter by price range
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }

      // Filter by bedrooms
      if (filters.bedrooms !== null && property.bedrooms < filters.bedrooms) {
        return false;
      }

      // Filter by bathrooms
      if (filters.bathrooms !== null && property.bathrooms < filters.bathrooms) {
        return false;
      }

      // Filter by property type
      if (filters.propertyType !== null && property.type !== filters.propertyType) {
        return false;
      }

      // Filter by keywords
      if (filters.keywords) {
        const keywords = filters.keywords.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(keywords);
        const matchesAddress = property.address.toLowerCase().includes(keywords);
        const matchesTags = property.tags.some(tag => tag.toLowerCase().includes(keywords));
        
        if (!matchesTitle && !matchesAddress && !matchesTags) {
          return false;
        }
      }

      return true;
    });

    setFilteredProperties(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-800 font-medium">Properties</span>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Properties</h1>
        <p className="text-xl text-gray-600">
          Find your next home or investment from our curated list of properties.
        </p>
      </div>

      {/* Filters */}
      <PropertyFilters onFilterChange={handleFilterChange} />

      {/* Results count and sorting options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <p className="text-gray-600 mb-4 sm:mb-0">
          Showing <span className="font-medium">{filteredProperties.length}</span> properties
        </p>
        
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Sort by:</span>
          <select className="border rounded-md py-1 px-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="newest">Newest</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="beds-desc">Most Bedrooms</option>
            <option value="size-desc">Largest Size</option>
          </select>
        </div>
      </div>

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Properties Found</h2>
          <p className="text-gray-500 mb-6">
            There are currently no properties matching your criteria. Please try adjusting your search filters.
          </p>
          <button 
            onClick={() => setFilteredProperties(properties)}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* TODO: Add Pagination here */}
      {/* <div className="mt-12 text-center">
        <p className="text-gray-700">Pagination will go here.</p>
      </div> */}
    </div>
  );
};

export default PropertiesPage; 