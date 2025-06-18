/**
 * Properties Hook for EstateIQ
 * 
 * This hook provides property management state and API calls
 * for fetching, searching, creating, and managing property listings.
 */

import { useState, useCallback } from 'react';
import { 
  propertyService, 
  type Property, 
  type PropertySearchFilters,
  type CreatePropertyRequest,
  type PaginatedResponse,
  type AreaSearchRequest,
  type ApiResponse 
} from '../services';

interface PropertiesState {
  properties: Property[];
  currentProperty: Property | null;
  favorites: Property[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;
}

interface PropertiesActions {
  fetchProperties: (page?: number, limit?: number, filters?: PropertySearchFilters) => Promise<void>;
  fetchPropertyById: (id: string) => Promise<Property | null>;
  searchProperties: (filters: PropertySearchFilters, page?: number, limit?: number) => Promise<void>;
  searchByArea: (areaData: AreaSearchRequest) => Promise<Property[]>;
  createProperty: (propertyData: CreatePropertyRequest) => Promise<Property | null>;
  updateProperty: (id: string, propertyData: Partial<CreatePropertyRequest>) => Promise<Property | null>;
  deleteProperty: (id: string) => Promise<boolean>;
  fetchFavorites: () => Promise<void>;
  addToFavorites: (propertyId: string) => Promise<boolean>;
  removeFromFavorites: (propertyId: string) => Promise<boolean>;
  clearError: () => void;
  resetProperties: () => void;
}

type UsePropertiesReturn = PropertiesState & PropertiesActions;

/**
 * Custom hook for property management
 */
export const useProperties = (): UsePropertiesReturn => {
  const [state, setState] = useState<PropertiesState>({
    properties: [],
    currentProperty: null,
    favorites: [],
    isLoading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    total: 0
  });

  /**
   * Fetch properties with pagination and filters
   */
  const fetchProperties = useCallback(async (
    page: number = 1, 
    limit: number = 10, 
    filters?: PropertySearchFilters
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use searchProperties for paginated results, or getPropertiesOptimized for simple arrays
      let response: ApiResponse<PaginatedResponse<Property>>;
      
      if (filters && Object.keys(filters).length > 0) {
        // Use searchProperties for filtered results with pagination
        response = await propertyService.searchProperties(filters, page, limit);
      } else {
        // For no filters, we need to use getPropertiesOptimized and create pagination structure
        const simpleResponse = await propertyService.getPropertiesOptimized(page, limit);
        
        if (simpleResponse.success && simpleResponse.data) {
          // Create a mock paginated response since getPropertiesOptimized doesn't return pagination info
          response = {
            success: true,
            data: {
              items: simpleResponse.data,
              total: simpleResponse.data.length,
              page: page,
              limit: limit,
              totalPages: Math.ceil(simpleResponse.data.length / limit)
            }
          };
        } else {
          response = {
            success: false,
            error: simpleResponse.error || 'Failed to fetch properties'
          };
        }
      }
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          properties: response.data!.items,
          totalPages: response.data!.totalPages,
          currentPage: response.data!.page,
          total: response.data!.total,
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Failed to fetch properties'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch properties'
      }));
    }
  }, []);

  /**
   * Fetch single property by ID
   */
  const fetchPropertyById = useCallback(async (id: string): Promise<Property | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response: ApiResponse<Property> = await propertyService.getPropertyById(id);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          currentProperty: response.data!,
          isLoading: false
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Property not found'
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch property'
      }));
      return null;
    }
  }, []);

  /**
   * Search properties with filters
   */
  const searchProperties = useCallback(async (
    filters: PropertySearchFilters,
    page: number = 1,
    limit: number = 10
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response: ApiResponse<PaginatedResponse<Property>> = await propertyService.searchProperties(filters, page, limit);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          properties: response.data!.items,
          totalPages: response.data!.totalPages,
          currentPage: response.data!.page,
          total: response.data!.total,
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Search failed'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Search failed'
      }));
    }
  }, []);

  /**
   * Search properties by area (for map-based searches)
   */
  const searchByArea = useCallback(async (areaData: AreaSearchRequest): Promise<Property[]> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response: ApiResponse<Property[]> = await propertyService.searchPropertiesByArea(areaData);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          properties: response.data!,
          isLoading: false
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Area search failed'
        }));
        return [];
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Area search failed'
      }));
      return [];
    }
  }, []);

  /**
   * Create new property
   */
  const createProperty = useCallback(async (propertyData: CreatePropertyRequest): Promise<Property | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response: ApiResponse<Property> = await propertyService.createProperty(propertyData);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          properties: [response.data!, ...prev.properties],
          isLoading: false
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Failed to create property'
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create property'
      }));
      return null;
    }
  }, []);

  /**
   * Update property
   */
  const updateProperty = useCallback(async (
    id: string, 
    propertyData: Partial<CreatePropertyRequest>
  ): Promise<Property | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response: ApiResponse<Property> = await propertyService.updateProperty(id, propertyData);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          properties: prev.properties.map(p => p.id === id ? response.data! : p),
          currentProperty: prev.currentProperty?.id === id ? response.data! : prev.currentProperty,
          isLoading: false
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Failed to update property'
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update property'
      }));
      return null;
    }
  }, []);

  /**
   * Delete property
   */
  const deleteProperty = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await propertyService.deleteProperty(id);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          properties: prev.properties.filter(p => p.id !== id),
          currentProperty: prev.currentProperty?.id === id ? null : prev.currentProperty,
          isLoading: false
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Failed to delete property'
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete property'
      }));
      return false;
    }
  }, []);

  /**
   * Fetch user's favorite properties
   */
  const fetchFavorites = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response: ApiResponse<Property[]> = await propertyService.getFavoriteProperties();
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          favorites: response.data!,
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Failed to fetch favorites'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch favorites'
      }));
    }
  }, []);

  /**
   * Add property to favorites
   */
  const addToFavorites = useCallback(async (propertyId: string): Promise<boolean> => {
    try {
      const response = await propertyService.addToFavorites(propertyId);
      
      if (response.success) {
        // Optionally refetch favorites or add to local state
        await fetchFavorites();
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || 'Failed to add to favorites'
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add to favorites'
      }));
      return false;
    }
  }, [fetchFavorites]);

  /**
   * Remove property from favorites
   */
  const removeFromFavorites = useCallback(async (propertyId: string): Promise<boolean> => {
    try {
      const response = await propertyService.removeFromFavorites(propertyId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          favorites: prev.favorites.filter(p => p.id !== propertyId)
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || 'Failed to remove from favorites'
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to remove from favorites'
      }));
      return false;
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Reset properties state
   */
  const resetProperties = useCallback(() => {
    setState({
      properties: [],
      currentProperty: null,
      favorites: [],
      isLoading: false,
      error: null,
      totalPages: 0,
      currentPage: 1,
      total: 0
    });
  }, []);

  return {
    ...state,
    fetchProperties,
    fetchPropertyById,
    searchProperties,
    searchByArea,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    clearError,
    resetProperties
  };
}; 