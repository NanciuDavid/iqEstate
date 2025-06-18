/**
 * Property Service for EstateIQ Frontend
 * 
 * This service handles all property-related API calls including
 * property listings, search, CRUD operations, and favorites management.
 */

import { apiService, type ApiResponse } from './api';

/**
 * Property interface matching the backend schema
 */
export interface Property {
  tags: string[];
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  listingType: 'SALE' | 'RENT';
  status: 'ACTIVE' | 'PENDING' | 'SOLD' | 'RENTED';
  images?: string[];
  features?: string[];
  yearBuilt?: number;
  garage?: boolean;
  garden?: boolean;
  pool?: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  predictedPrice?: number;
  predictionConfidence?: number;
}

/**
 * Property search filters interface
 */
export interface PropertySearchFilters {
  city?: string;
  state?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  listingType?: 'SALE' | 'RENT';
  areaMin?: number;
  areaMax?: number;
  features?: string[];
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  garage?: boolean;
  garden?: boolean;
  pool?: boolean;
}

/**
 * Property creation interface
 */
export interface CreatePropertyRequest {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  listingType: 'SALE' | 'RENT';
  images?: string[];
  features?: string[];
  yearBuilt?: number;
  garage?: boolean;
  garden?: boolean;
  pool?: boolean;
}

/**
 * Pagination interface for property requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Optimized property search filters with pagination
 */
export interface OptimizedPropertyFilters extends PropertySearchFilters {
  pagination?: PaginationParams;
  includeImages?: boolean; // Option to exclude images for faster loading
  includePredictions?: boolean; // Option to exclude ML predictions
  fields?: string[]; // Specific fields to return
}

/**
 * Property search interface for map-based searches
 */
export interface AreaSearchRequest {
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  filters?: OptimizedPropertyFilters;
}

/**
 * Polygon search interface for map drawing searches
 */
export interface PolygonSearchRequest {
  polygon: number[][]; // Array of [latitude, longitude] coordinates defining the polygon
  filters?: OptimizedPropertyFilters;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Property Service Class
 */
class PropertyService {
  /**
   * Get all properties with optional filters and pagination
   */
  async getProperties(filters?: OptimizedPropertyFilters): Promise<ApiResponse<Property[]>> {
    const params = new URLSearchParams();
    
    // Add pagination parameters
    if (filters?.pagination?.page) {
      params.append('page', filters.pagination.page.toString());
    }
    if (filters?.pagination?.limit) {
      params.append('limit', filters.pagination.limit.toString());
    }
    
    // Add optimization flags
    if (filters?.includeImages === false) {
      params.append('includeImages', 'false');
    }
    if (filters?.includePredictions === false) {
      params.append('includePredictions', 'false');
    }
    
    // Add filter parameters
    if (filters?.propertyType) {
      params.append('propertyType', filters.propertyType);
    }
    if (filters?.listingType) {
      params.append('listingType', filters.listingType);
    }
    if (filters?.priceMin) {
      params.append('priceMin', filters.priceMin.toString());
    }
    if (filters?.priceMax) {
      params.append('priceMax', filters.priceMax.toString());
    }
    if (filters?.areaMin) {
      params.append('areaMin', filters.areaMin.toString());
    }
    if (filters?.areaMax) {
      params.append('areaMax', filters.areaMax.toString());
    }
    if (filters?.bedrooms) {
      params.append('bedrooms', filters.bedrooms.toString());
    }
    if (filters?.city) {
      params.append('city', filters.city);
    }
    if (filters?.state) {
      params.append('state', filters.state);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';
    
    return apiService.get<Property[]>(endpoint);
  }

  /**
   * Get properties optimized for list view (minimal data)
   */
  async getPropertiesOptimized(page = 1, limit = 20): Promise<ApiResponse<Property[]>> {
    return this.getProperties({
      pagination: { page, limit },
      includeImages: true, // Keep images but they'll be optimized on backend
      includePredictions: false // Skip predictions for faster loading
    });
  }
  
  /**
   * Get property by ID
   */
  async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    return apiService.get<Property>(`/properties/${id}`);
  }
  
  /**
   * Create new property listing
   */
  async createProperty(propertyData: CreatePropertyRequest): Promise<ApiResponse<Property>> {
    return apiService.post<Property>('/properties', propertyData);
  }
  
  /**
   * Update existing property
   */
  async updateProperty(id: string, propertyData: Partial<CreatePropertyRequest>): Promise<ApiResponse<Property>> {
    return apiService.put<Property>(`/properties/${id}`, propertyData);
  }
  
  /**
   * Delete property
   */
  async deleteProperty(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/properties/${id}`);
  }
  
  /**
   * Search properties by area (for map-based searches)
   */
  async searchPropertiesByArea(searchData: AreaSearchRequest): Promise<ApiResponse<Property[]>> {
    return apiService.post<Property[]>('/properties/search-by-area', searchData);
  }
  
  /**
   * Search properties within a drawn polygon (for map drawing searches)
   */
  async searchPropertiesByPolygon(searchData: PolygonSearchRequest): Promise<ApiResponse<Property[]>> {
    try {
      // Convert the polygon coordinates to the format expected by the backend
      const polygon = searchData.polygon;
      
      if (!polygon || polygon.length < 3) {
        return {
          success: false,
          error: 'Invalid polygon: at least 3 coordinates required'
        };
      }
      
      // Convert [lat, lng] format to {lat, lng} format expected by backend
      const coordinates = polygon.map(coord => ({
        lat: coord[0], // First element is latitude
        lng: coord[1]  // Second element is longitude
      }));
      
      console.log('Sending polygon coordinates to backend:', coordinates);
      
      // Prepare the request payload matching backend expectations
      const requestPayload = {
        coordinates: coordinates,
        filters: {
          // Map frontend filter format to backend expectations
          ...(searchData.filters?.listingType && { listingType: searchData.filters.listingType }),
          ...(searchData.filters?.propertyType && { type: searchData.filters.propertyType }),
          ...(searchData.filters?.priceMin && { minPrice: searchData.filters.priceMin }),
          ...(searchData.filters?.priceMax && { maxPrice: searchData.filters.priceMax }),
        }
      };
      
      // Use the existing area search endpoint which handles coordinates
      return apiService.post<Property[]>('/properties/search-by-area', requestPayload);
      
    } catch (error) {
      console.error('Error in polygon search:', error);
      return {
        success: false,
        error: 'Failed to search properties within the selected area'
      };
    }
  }
  
  /**
   * Search properties with advanced filters
   */
  async searchProperties(
    filters: PropertySearchFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Property>>> {
    const searchData = {
      filters,
      page,
      limit
    };
    
    return apiService.post<PaginatedResponse<Property>>('/properties/search', searchData);
  }
  
  /**
   * Get user's property listings
   */
  async getUserProperties(): Promise<ApiResponse<Property[]>> {
    return apiService.get<Property[]>('/properties/my-listings');
  }
  
  /**
   * Get user's favorite properties
   */
  async getFavoriteProperties(): Promise<ApiResponse<Property[]>> {
    return apiService.get<Property[]>('/users/favorites');
  }
  
  /**
   * Add property to favorites
   */
  async addToFavorites(propertyId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.post<{ message: string }>(`/users/favorites/${propertyId}`);
  }
  
  /**
   * Remove property from favorites
   */
  async removeFromFavorites(propertyId: string): Promise<ApiResponse<{ message: string }>> {
    return apiService.delete<{ message: string }>(`/users/favorites/${propertyId}`);
  }
  
  /**
   * Get property statistics for dashboard
   */
  async getPropertyStats(): Promise<ApiResponse<{
    totalProperties: number;
    averagePrice: number;
    propertiesByType: Record<string, number>;
    propertiesByCity: Record<string, number>;
  }>> {
    return apiService.get('/properties/stats');
  }
  
  /**
   * Upload property images
   */
  async uploadPropertyImages(propertyId: string, images: File[]): Promise<ApiResponse<{ imageUrls: string[] }>> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });
    
    // Note: This would require special handling for FormData in apiService
    // For now, using direct fetch
    const token = localStorage.getItem('estateiq_token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/properties/${propertyId}/images`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    
    const data = await response.json();
    return {
      success: response.ok,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.message || 'Upload failed'
    };
  }
}

// Export singleton instance
export const propertyService = new PropertyService(); 