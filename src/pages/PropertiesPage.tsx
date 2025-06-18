import React, { useEffect, useState } from 'react';
import { PropertyCard } from '../components/properties/PropertyCard';
import PropertyFilters, { FilterState } from '../components/properties/PropertyFilters';
import { Property } from '../types/property';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services';

// Type for raw backend property response before transformation
interface BackendPropertyResponse {
  id: string;
  title?: string;
  price?: number;
  predictedPrice?: number;
  surface?: number;
  bedrooms?: number;
  bathrooms?: number;
  address?: string;
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  type?: string;
  yearBuilt?: number;
  images?: string[];
  newListing?: boolean;
  listedDate?: string;
  [key: string]: unknown; // For any additional backend fields
}

const PropertiesPage: React.FC = () => {
  // === COMPONENT STATE ===
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // === DATA FETCHING ===
  useEffect(() => {
    /**
     * Async function to fetch all properties from the backend
     * Handles API calls, data transformation, and error scenarios
     */
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('🔄 Fetching all properties from backend...');
        console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api');
        
        // Fetch properties from the API (reduced for faster initial load)
        const response = await propertyService.getPropertiesOptimized(1, 20); // Much smaller initial load
        console.log('📡 Raw API Response:', response);
        
        if (response.success && response.data && Array.isArray(response.data)) {
          console.log(`📋 Found ${response.data.length} properties from backend`);
          console.log('📋 Sample property structure:', response.data[0]);
          
          // Cast the response data to our expected backend type
          const backendProperties = response.data as unknown as BackendPropertyResponse[];
          
          // Transform backend data to frontend Property objects
          const propertiesData: Property[] = backendProperties.map((prop): Property => ({
            id: prop.id,
            title: prop.title || 'Property Title Not Available',
            price: Number(prop.price) || 0,
            predictedPrice: prop.predictedPrice ? Number(prop.predictedPrice) : undefined,
            pricePerSqft: prop.surface && prop.price ? Math.round(prop.price / prop.surface) : undefined,
            surface: Number(prop.surface) || 0,
            bedrooms: prop.bedrooms || 1,
            bathrooms: prop.bathrooms || 1,
            address: prop.address || 'Address Not Available',
            city: prop.city,
            county: prop.county,
            latitude: prop.latitude,
            longitude: prop.longitude,
            type: (prop.type || 'APARTMENT') as Property['type'],
            status: 'AVAILABLE' as Property['status'],
            listingType: 'SALE' as Property['listingType'],
            yearBuilt: prop.yearBuilt,
            description: `Property with ${prop.surface || 0}m², ${prop.bedrooms || 1} bedrooms in ${prop.city || 'Unknown location'}.`,
            images: prop.images && prop.images.length > 0 ? prop.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'],
            tags: [],
            featured: false, // Properties page shows all properties, not just featured
            newListing: prop.newListing || false,
            listedDate: prop.listedDate,
            lastUpdated: prop.listedDate,
            ownerId: 'system',
            ownerName: 'Property Owner',
            ownerEmail: 'owner@estateiq.ro',
            ownerPhone: '+40 XXX XXX XXX'
          }));
          
          console.log('✅ Successfully processed backend properties:', propertiesData);
          setProperties(propertiesData);
          
                      // Apply initial sorting to all properties
            const sortedProperties = sortProperties(propertiesData, sortBy);
            setFilteredProperties(sortedProperties); // Initially show all properties with sorting
            setIsLoading(false);
        } else {
          console.error('❌ API response not successful:', response);
          throw new Error(response.error || 'Failed to fetch properties');
        }
        
      } catch (error) {
        console.error('❌ Error fetching properties:', error);
        
        // Set error state and empty properties
        setProperties([]);
        setFilteredProperties([]);
        setError(error instanceof Error ? error.message : 'Failed to load properties from database');
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [sortBy]); // Re-run when sort option changes

  // Check if any filters are active
  const hasActiveFilters = (filters: FilterState): boolean => {
    return (
      filters.keywords.trim() !== '' ||
      filters.propertyType !== null ||
      filters.bedrooms !== null ||
      filters.bathrooms !== null ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 2000000
    );
  };

  // Sort properties based on selected option
  const sortProperties = (properties: Property[], sortOption: string): Property[] => {
    const sorted = [...properties];
    
    switch (sortOption) {
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.listedDate || '').getTime();
          const dateB = new Date(b.listedDate || '').getTime();
          return dateB - dateA; // Newest first
        });
      
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      
      case 'beds-desc':
        return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
      
      case 'size-desc':
        return sorted.sort((a, b) => b.surface - a.surface);
      
      default:
        return sorted;
    }
  };

  // Apply filters to the properties
  const handleFilterChange = async (filters: FilterState) => {
    console.log('🔍 Filtering properties with filters:', filters);
    
    // Store active filters for UI display
    setActiveFilters(hasActiveFilters(filters) ? filters : null);
    
    // If no filters are active, show the initial loaded properties
    if (!hasActiveFilters(filters)) {
      const sortedProperties = sortProperties(properties, sortBy);
      setFilteredProperties(sortedProperties);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Prepare backend-compatible filters
      const backendFilters: Record<string, string | number> = {};
      
      // Convert frontend filters to backend format
      if (filters.propertyType) {
        backendFilters.propertyType = filters.propertyType;
      }
      
      if (filters.bedrooms !== null) {
        backendFilters.bedrooms = filters.bedrooms;
      }
      
      if (filters.bathrooms !== null) {
        backendFilters.bathrooms = filters.bathrooms;
      }
      
      if (filters.priceRange[0] > 0) {
        backendFilters.priceMin = filters.priceRange[0];
      }
      
      if (filters.priceRange[1] < 2000000) {
        backendFilters.priceMax = filters.priceRange[1];
      }
      
      if (filters.keywords && filters.keywords.trim() !== '') {
        // For keywords, we'll use city search as a starting point
        backendFilters.city = filters.keywords.trim();
      }
      
      console.log('🔍 Making backend search with filters:', backendFilters);
      
      // Make API call to search entire database
      const response = await propertyService.getProperties({ 
        ...backendFilters,
        pagination: { page: 1, limit: 1000 } // Get a larger set for filtering
      });
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`📋 Found ${response.data.length} properties from backend search`);
        
        // Cast the response data to our expected backend type
        const backendProperties = response.data as unknown as BackendPropertyResponse[];
        
        // Transform backend data to frontend Property objects
        const searchResults: Property[] = backendProperties.map((prop): Property => ({
          id: prop.id,
          title: prop.title || 'Property Title Not Available',
          price: Number(prop.price) || 0,
          predictedPrice: prop.predictedPrice ? Number(prop.predictedPrice) : undefined,
          pricePerSqft: prop.surface && prop.price ? Math.round(prop.price / prop.surface) : undefined,
          surface: Number(prop.surface) || 0,
          bedrooms: prop.bedrooms || 1,
          bathrooms: prop.bathrooms || 1,
          address: prop.address || 'Address Not Available',
          city: prop.city,
          county: prop.county,
          latitude: prop.latitude,
          longitude: prop.longitude,
          type: (prop.type || 'APARTMENT') as Property['type'],
          status: 'AVAILABLE' as Property['status'],
          listingType: 'SALE' as Property['listingType'],
          yearBuilt: prop.yearBuilt,
          description: `Property with ${prop.surface || 0}m², ${prop.bedrooms || 1} bedrooms in ${prop.city || 'Unknown location'}.`,
          images: prop.images && prop.images.length > 0 ? prop.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'],
          tags: [],
          featured: false,
          newListing: prop.newListing || false,
          listedDate: prop.listedDate,
          lastUpdated: prop.listedDate,
          ownerId: 'system',
          ownerName: 'Property Owner',
          ownerEmail: 'owner@estateiq.ro',
          ownerPhone: '+40 XXX XXX XXX'
        }));
        
        // Apply additional frontend filtering for keywords if needed (since backend might not support full text search)
        let finalResults = searchResults;
        
        if (filters.keywords && filters.keywords.trim() !== '') {
          const keywords = filters.keywords.toLowerCase().trim();
          finalResults = searchResults.filter(property => {
            const matchesTitle = property.title.toLowerCase().includes(keywords);
            const matchesAddress = property.address.toLowerCase().includes(keywords);
            const matchesCity = property.city?.toLowerCase().includes(keywords) || false;
            const matchesCounty = property.county?.toLowerCase().includes(keywords) || false;
            const matchesTags = property.tags && property.tags.some(tag => tag.toLowerCase().includes(keywords));
            
            return matchesTitle || matchesAddress || matchesCity || matchesCounty || matchesTags;
          });
        }
        
        console.log(`📋 Final filtered results: ${finalResults.length} properties`);
        
        // Apply sorting to search results
        const sortedResults = sortProperties(finalResults, sortBy);
        setFilteredProperties(sortedResults);
        
      } else {
        console.error('❌ Search API response not successful:', response);
        setError('Failed to search properties');
      }
      
    } catch (error) {
      console.error('❌ Error searching properties:', error);
      setError('Failed to search properties');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = e.target.value;
    console.log('🔄 Changing sort to:', newSortOption);
    setSortBy(newSortOption);
    
    // Re-sort current filtered properties
    const sortedProperties = sortProperties(filteredProperties, newSortOption);
    setFilteredProperties(sortedProperties);
  };

  // === RENDER ===
  
  // Loading state
  if (isLoading) {
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
            Loading properties from our database...
          </p>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={`skeleton-${i}`} 
              className="bg-gray-200 animate-pulse rounded-xl h-96"
              aria-label="Loading property..."
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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

        <div className="text-center py-12">
          <div className="text-red-500">
            <p className="text-lg font-medium">Failed to load properties from database</p>
            <p className="text-sm mt-2 text-gray-600">{error}</p>
            <p className="text-sm mt-4 text-gray-500">
              Please check your backend connection and database setup.
            </p>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Active filters indicator */}
      {activeFilters && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 font-medium">
              🔍 Filters applied - Showing filtered results
            </span>
            <button 
              onClick={() => {
                const sortedProperties = sortProperties(properties, sortBy);
                setFilteredProperties(sortedProperties);
                setActiveFilters(null);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Results count and sorting options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="text-gray-600 mb-4 sm:mb-0">
          <p>
            Showing <span className="font-medium">{filteredProperties.length}</span> of <span className="font-medium">{properties.length}</span> properties
            {activeFilters && <span className="text-blue-600 ml-2">(filtered)</span>}
          </p>
          {filteredProperties.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Sorted by: <span className="font-medium">
                {sortBy === 'newest' && 'Newest First'}
                {sortBy === 'price-asc' && 'Price (Low to High)'}
                {sortBy === 'price-desc' && 'Price (High to Low)'}
                {sortBy === 'beds-desc' && 'Most Bedrooms'}
                {sortBy === 'size-desc' && 'Largest Size'}
              </span>
            </p>
          )}
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Sort by:</span>
          <select 
            value={sortBy}
            onChange={handleSortChange}
            className="border rounded-md py-1 px-2 focus:ring-blue-500 focus:border-blue-500"
          >
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
            <PropertyCard 
              key={property.id} 
              property={property}
              className="h-full"
              onFavoriteChange={(propertyId, isFavorite) => {
                console.log(`Property ${propertyId} favorite status: ${isFavorite}`);
                // TODO: Implement API call to save favorite status
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Properties Found</h2>
          <p className="text-gray-500 mb-6">
            {properties.length === 0 
              ? "There are currently no properties in the database." 
              : "There are currently no properties matching your criteria. Please try adjusting your search filters."
            }
          </p>
          {properties.length > 0 && (
            <button 
              onClick={() => {
                const sortedProperties = sortProperties(properties, sortBy);
                setFilteredProperties(sortedProperties);
                setActiveFilters(null);
              }}
              className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Clear All Filters
            </button>
          )}
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