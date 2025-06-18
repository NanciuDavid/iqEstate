/**
 * FeaturedProperties Component for EstateIQ
 * 
 * Displays a curated selection of featured properties on the homepage.
 * Handles data fetching from the backend API with proper error handling and fallback.
 * 
 * Features:
 * - Fetches properties from backend API
 * - Professional data transformation using dedicated service
 * - Graceful fallback to mock data when backend unavailable
 * - Loading states and error handling
 * - Responsive grid layout
 * - Professional logging and debugging
 */

import React, { useState, useEffect } from 'react';
import { PropertyCard } from '../properties/PropertyCard';
import { 
  Property, 
  PropertyType,
  PropertyStatus,
  ListingType 
} from '../../types/property';

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
import { propertyService } from '../../services';

const FeaturedProperties: React.FC = () => {
  
  // === COMPONENT STATE ===
  const [featuredProperties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // === HELPER FUNCTIONS ===

  // === DATA FETCHING ===
  useEffect(() => {
    /**
     * Async function to fetch featured properties from the backend
     * Handles API calls, data transformation, and error scenarios
     */
    const fetchFeaturedProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('🔄 Fetching featured properties from backend...');
        console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api');
        
        // Fetch first 3 properties from the API (page 1, limit 3)
        const response = await propertyService.getPropertiesOptimized(1, 3);
        console.log('📡 Raw API Response:', response);
        
        if (response.success && response.data && Array.isArray(response.data)) {
          console.log(`📋 Found ${response.data.length} properties from backend`);
          console.log('📋 Sample property structure:', response.data[0]);
          console.log('📋 Images for first property:', response.data[0]?.images);
          
          // Cast the response data to our expected backend type
          const backendProperties = response.data as unknown as BackendPropertyResponse[];
          
          // Transform backend data to frontend Property objects
          const propertiesData: Property[] = backendProperties.slice(0, 3).map((prop): Property => ({
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
            type: (prop.type || 'APARTMENT') as PropertyType,
            status: 'AVAILABLE' as PropertyStatus,
            listingType: 'SALE' as ListingType,
            yearBuilt: prop.yearBuilt,
            description: `Property with ${prop.surface || 0}m², ${prop.bedrooms || 1} bedrooms in ${prop.city || 'Unknown location'}.`,
            images: prop.images && prop.images.length > 0 ? prop.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'],
            tags: [],
            featured: true,
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
          setIsLoading(false);
        } else {
          console.error('❌ API response not successful:', response);
          throw new Error(response.error || 'Failed to fetch properties');
        }
        
      } catch (error) {
        console.error('❌ Error fetching featured properties:', error);
        
        // Set error state and empty properties
        setProperties([]);
        setError(error instanceof Error ? error.message : 'Failed to load properties from database');
        setIsLoading(false);
      }
    };
    
    fetchFeaturedProperties();
  }, []);

  /**
   * Handle favorite changes from PropertyCard components
   */
  const handleFavoriteChange = (propertyId: string, isFavorite: boolean) => {
    console.log(`Property ${propertyId} favorite status: ${isFavorite}`);
    // TODO: Implement API call to save favorite status
  };

  // === RENDER ===
  
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div 
            key={`skeleton-${i}`} 
            className="bg-gray-200 animate-pulse rounded-xl h-96"
            aria-label="Loading property..."
          />
        ))}
      </div>
    );
  }

  // Error state - show error message if there was an issue loading from database
  if (error) {
    return (
      <div className="grid grid-cols-1 gap-8">
        <div className="col-span-full text-center py-12 text-red-500">
          <p className="text-lg font-medium">Failed to load properties from database</p>
          <p className="text-sm mt-2 text-gray-600">{error}</p>
          <p className="text-sm mt-4 text-gray-500">
            Please check your backend connection and database setup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredProperties.map((property) => (
        <PropertyCard 
          key={property.id} 
          property={property}
          onFavoriteChange={handleFavoriteChange}
          className="h-full"
        />
      ))}
      
      {/* Show message if no properties are available */}
      {featuredProperties.length === 0 && !isLoading && (
        <div className="col-span-full text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No properties found in database.</p>
          <p className="text-sm mt-2">Please add some properties to your database to display them here.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedProperties;