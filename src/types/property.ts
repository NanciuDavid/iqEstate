/**
 * EstateIQ Property Type Definitions
 * 
 * This file contains comprehensive type definitions for the property system,
 * aligned with the Prisma database schema and organized for maximum type safety.
 */

// === ENUMS (matching database enums) ===

export type PropertyType = 'APARTMENT' | 'HOUSE' | 'LAND' | 'OTHER_PROPERTY';
export type PropertyStatus = 'AVAILABLE' | 'SOLD' | 'RENTED' | 'PENDING' | 'UNAVAILABLE' | 'DRAFT';
export type ListingType = 'SALE' | 'RENT';
export type Currency = 'EUR' | 'RON' | 'USD';

// === DATABASE ENTITY TYPES ===

/**
 * Complete property entity as stored in the database
 * Maps directly to the Prisma 'properties' model
 */
export interface DatabaseProperty {
  // Primary identifiers
  internal_property_id: string;
  source_listing_id: string;
  source_name: string;
  source_url?: string;
  
  // Basic property information
  title?: string;
  property_category?: string;
  listing_type?: ListingType;
  
  // Financial information
  price?: number;
  currency?: Currency;
  price_per_sqm?: number;
  rent_price?: number;
  
  // Location information
  country_id?: number;
  address_text?: string;
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  
  // Property specifications
  total_surface_area?: number;
  number_of_rooms?: number;
  construction_year?: number;
  
  // Condition and features
  property_condition_scraped?: string;
  property_form_scraped?: string;
  is_new_building_bool?: boolean;
  
  // Accessibility and nearby facilities
  accessibility_score?: number;
  facility_count?: number;
  accessibility_label?: string;
  
  // System fields
  image_count?: number;
  date_scraped?: string;
  date_last_scraped?: string;
  is_active_on_source?: boolean;
  date_created?: string;
  last_modified_at?: string;
  
  // Relations (populated separately)
  property_images?: PropertyImage[];
  ml_price_predictions?: PricePrediction[];
  property_to_feature_link?: PropertyFeature[];
  apartment_details?: ApartmentDetails;
  house_details?: HouseDetails;
}

/**
 * Property image entity
 */
export interface PropertyImage {
  image_id: number;
  property_id: string;
  image_url: string;
  s3_bucket?: string;
  s3_key?: string;
  is_primary?: boolean;
  sort_order?: number;
  date_added?: string;
}

/**
 * ML price prediction entity
 */
export interface PricePrediction {
  prediction_id: number;
  property_id: string;
  model_version: string;
  predicted_price: number;
  prediction_date?: string;
  confidence_score?: number;
  feature_importance?: Record<string, unknown>;
}

/**
 * Property feature/amenity link
 */
export interface PropertyFeature {
  property_id: string;
  feature_id: number;
  features_and_amenities?: {
    feature_id: number;
    feature_name: string;
    category?: string;
  };
}

/**
 * Apartment-specific details
 */
export interface ApartmentDetails {
  property_id: string;
  apartment_type_scraped?: string;
  floor_number_parsed?: number;
  total_floors_in_building?: number;
  building_type_scraped?: string;
  heating_system_scraped?: string;
  is_furnished_scraped?: string;
  has_balcony?: boolean;
  has_elevator?: boolean;
}

/**
 * House-specific details
 */
export interface HouseDetails {
  property_id: string;
  house_type_scraped?: string;
  floors_scraped?: string;
  heating_system_scraped?: string;
  land_surface_area?: number;
  construction_material_scraped?: string;
  has_garden_bool?: boolean;
  has_pool_bool?: boolean;
  has_garage_bool?: boolean;
}

// === FRONTEND DISPLAY TYPES ===

/**
 * Simplified property interface optimized for frontend display
 * Used by React components for rendering property information
 */
export interface Property {
  // Core identifiers
  id: string;
  title: string;
  
  // Financial information
  price: number;
  predictedPrice?: number;
  pricePerSqft?: number;
  currency?: Currency;
  
  // Property specifications
  surface: number;        // Maps from total_surface_area
  bedrooms: number;       // Maps from number_of_rooms or apartment/house details
  bathrooms: number;      // Derived from apartment/house details
  
  // Location information
  address: string;        // Maps from address_text
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  
  // Property metadata
  type: PropertyType;     // Maps from property_category
  status: PropertyStatus;
  listingType: ListingType;
  yearBuilt?: number;     // Maps from construction_year
  
  // Content
  description?: string;
  images: string[];       // Array of image URLs
  tags: string[];         // Feature/amenity names
  
  // UI flags
  featured?: boolean;     // Computed based on business logic
  newListing?: boolean;   // Computed from date_created
  
  // Dates
  listedDate?: string;    // Maps from date_created
  lastUpdated?: string;   // Maps from last_modified_at
  
  // Owner information (placeholder for MVP)
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

// === API RESPONSE TYPES ===

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Property search filters
 */
export interface PropertySearchFilters {
  // Location filters
  city?: string;
  county?: string;
  
  // Price filters
  minPrice?: number;
  maxPrice?: number;
  
  // Property specifications
  propertyType?: PropertyType;
  minSurface?: number;
  maxSurface?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  
  // Year filters
  minYearBuilt?: number;
  maxYearBuilt?: number;
  
  // Features
  features?: string[];
  
  // Listing preferences
  listingType?: ListingType;
  newListingsOnly?: boolean;
  
  // Sorting
  sortBy?: 'price' | 'date' | 'surface' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Property search response
 */
export interface PropertySearchResponse extends PaginatedResponse<Property> {
  filters: PropertySearchFilters;
  searchTime: number;
}

// === UTILITY TYPES ===

/**
 * Property creation input (for forms)
 */
export interface CreatePropertyInput {
  title: string;
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  county?: string;
  type: PropertyType;
  listingType: ListingType;
  yearBuilt?: number;
  description?: string;
  features?: string[];
}

/**
 * Property update input (for forms)
 */
export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {
  id: string;
}

export default Property;