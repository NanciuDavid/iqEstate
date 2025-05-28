import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string | null;
  keywords: string;
}

const initialFilters: FilterState = {
  priceRange: [0, 2000000],
  bedrooms: null,
  bathrooms: null,
  propertyType: null,
  keywords: '',
};

const propertyTypes = ['All Types', 'Apartment', 'House', 'Condo', 'Penthouse', 'Townhouse', 'Studio'];

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'minPrice' || name === 'maxPrice') {
      const priceRange = [...filters.priceRange] as [number, number];
      if (name === 'minPrice') {
        priceRange[0] = parseInt(value) || 0;
      } else {
        priceRange[1] = parseInt(value) || 0;
      }
      setFilters({ ...filters, priceRange });
    } else if (name === 'bedrooms' || name === 'bathrooms') {
      const numValue = value === '' ? null : parseInt(value);
      setFilters({ ...filters, [name]: numValue });
    } else if (name === 'propertyType') {
      const typeValue = value === 'All Types' ? null : value;
      setFilters({ ...filters, [name]: typeValue });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm text-blue-900 hover:text-blue-700"
          >
            {isExpanded ? (
              <>
                <X className="w-4 h-4 mr-1" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-4 h-4 mr-1" />
                <span>Expand Filters</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-4">
          <div className="flex items-center relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="keywords"
              value={filters.keywords}
              onChange={handleInputChange}
              placeholder="Search by location, property name, or keywords..."
              className="w-full pl-10 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="propertyType"
                value={filters.propertyType || 'All Types'}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                name="bedrooms"
                value={filters.bedrooms === null ? '' : filters.bedrooms}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <select
                name="bathrooms"
                value={filters.bathrooms === null ? '' : filters.bathrooms}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.priceRange[0]}
                  onChange={handleInputChange}
                  placeholder="Min"
                  className="w-full py-2 px-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.priceRange[1]}
                  onChange={handleInputChange}
                  placeholder="Max"
                  className="w-full py-2 px-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
          <button
            type="button"
            onClick={resetFilters}
            className="text-gray-700 hover:text-gray-900"
          >
            Reset Filters
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilters; 