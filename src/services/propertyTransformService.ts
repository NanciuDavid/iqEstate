/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Property Data Transformation Service for EstateIQ
 * 
 * This service handles the conversion between database entities and frontend Property types.
 * It provides clean separation of concerns between data layer and presentation layer.
 * 
 * Note: This file uses 'any' types for flexible data transformation between different 
 * backend data structures. This is intentional and controlled.
 */

import { 
  Property, 
  PropertyType, 
  PropertyStatus,
  PropertyImage,
  PricePrediction,
  PropertyFeature 
} from '../types/property';

/**
 * Service class for transforming property data between different layers
 */
export class PropertyTransformService {
  
  /**
   * Transform a database property entity to a frontend Property object
   * @param dbProperty - The database property entity
   * @returns Transformed Property object for frontend use
   */
  static transformDatabaseToProperty(dbProperty: any): Property {
    try {
      // Extract the latest price prediction if available
      const latestPrediction = this.getLatestPricePrediction(dbProperty.ml_price_predictions);
      
      // Extract property images URLs from property_images table
      const imageUrls = this.extractImageUrls(dbProperty.property_images);
      
      // Extract feature/amenity tags
      const tags = this.extractFeatureTags(dbProperty.property_to_feature_link);
      
      // Determine bedrooms and bathrooms from property details
      const { bedrooms, bathrooms } = this.extractRoomDetails(dbProperty);
      
      return {
        // Core identifiers
        id: dbProperty.internal_property_id || dbProperty.id || '',
        title: dbProperty.title || 'Property Title Not Available',
        
        // Financial information
        price: Number(dbProperty.price) || 0,
        predictedPrice: latestPrediction?.predicted_price ? Number(latestPrediction.predicted_price) : undefined,
        pricePerSqft: dbProperty.price_per_sqm ? Number(dbProperty.price_per_sqm) : undefined,
        currency: dbProperty.currency,
        
        // Property specifications - handle various field names for surface area
        surface: Number(dbProperty.total_surface_area) || Number(dbProperty.area) || Number(dbProperty.surface) || 0,
        bedrooms,
        bathrooms,
        
        // Location information
        address: dbProperty.address_text || dbProperty.address || 'Address Not Available',
        city: dbProperty.city,
        county: dbProperty.county,
        latitude: dbProperty.latitude,
        longitude: dbProperty.longitude,
        
        // Property metadata
        type: this.mapPropertyType(dbProperty.property_category || dbProperty.propertyType),
        status: this.mapPropertyStatus(dbProperty.is_active_on_source),
        listingType: dbProperty.listing_type || 'SALE',
        yearBuilt: dbProperty.construction_year || dbProperty.yearBuilt,
        
        // Content
        description: this.generateDescription(dbProperty),
        images: imageUrls,
        tags,
        
        // UI flags
        featured: this.determineFeaturedStatus(dbProperty),
        newListing: this.isNewListing(dbProperty.date_created || dbProperty.createdAt),
        
        // Dates
        listedDate: dbProperty.date_created || dbProperty.createdAt,
        lastUpdated: dbProperty.last_modified_at || dbProperty.updatedAt,
        
        // Owner information (placeholder for MVP)
        ownerId: 'system',
        ownerName: 'Property Owner',
        ownerEmail: 'owner@estateiq.ro',
        ownerPhone: '+40 XXX XXX XXX'
      };
    } catch (error) {
      console.error('Error transforming database property:', error);
      throw new Error(`Failed to transform property ${dbProperty.internal_property_id}: ${error}`);
    }
  }
  
  /**
   * Transform multiple database properties to frontend Property objects
   * @param dbProperties - Array of database property entities
   * @returns Array of transformed Property objects
   */
  static transformDatabaseProperties(dbProperties: any[]): Property[] {
    return dbProperties
      .map(dbProperty => {
        try {
          return this.transformDatabaseToProperty(dbProperty);
        } catch (error) {
          console.error(`Skipping property ${dbProperty.internal_property_id} due to transformation error:`, error);
          return null;
        }
      })
      .filter((property): property is Property => property !== null);
  }
  
  // === PRIVATE HELPER METHODS ===
  
  /**
   * Get the latest price prediction from ML predictions
   */
  private static getLatestPricePrediction(predictions?: PricePrediction[]): PricePrediction | undefined {
    if (!predictions || predictions.length === 0) return undefined;
    
    return predictions.reduce((latest, current) => {
      const latestDate = new Date(latest.prediction_date || 0);
      const currentDate = new Date(current.prediction_date || 0);
      return currentDate > latestDate ? current : latest;
    });
  }
  
  /**
   * Extract image URLs from property_images table, prioritizing primary images
   * Based on your database schema: property_images table with image_url, is_primary, sort_order
   */
  private static extractImageUrls(propertyImages?: PropertyImage[]): string[] {
    console.log('🖼️ Processing property images:', propertyImages);
    
    // Check if we have property images from the database
    if (propertyImages && Array.isArray(propertyImages) && propertyImages.length > 0) {
      console.log(`📸 Found ${propertyImages.length} images in property_images table`);
      
      // Sort images: primary first, then by sort_order
      const sortedImages = propertyImages.sort((a, b) => {
        // Primary images come first
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        
        // Then sort by sort_order (lower numbers first)
        const orderA = a.sort_order || 999;
        const orderB = b.sort_order || 999;
        return orderA - orderB;
      });
      
      // Extract image URLs
      const imageUrls = sortedImages
        .map(img => img.image_url)
        .filter(url => url && url.length > 0); // Filter out empty URLs
      
      console.log('🎯 Extracted image URLs:', imageUrls);
      
      if (imageUrls.length > 0) {
        return imageUrls;
      }
    }
    
    console.log('⚠️ No valid images found, using default image');
    // Return default image if no images found
    return [this.getDefaultImageUrl()];
  }
  
  /**
   * Extract feature/amenity tags from property feature links
   */
  private static extractFeatureTags(featureLinks?: PropertyFeature[]): string[] {
    if (!featureLinks || featureLinks.length === 0) return [];
    
    return featureLinks
      .filter(link => link.features_and_amenities?.feature_name)
      .map(link => link.features_and_amenities!.feature_name)
      .slice(0, 10); // Limit to 10 tags for UI purposes
  }
  
  /**
   * Extract bedroom and bathroom counts from property details
   */
  private static extractRoomDetails(dbProperty: any): { bedrooms: number; bathrooms: number } {
    let bedrooms = dbProperty.number_of_rooms || 1;
    let bathrooms = 1; // Default value
    
    // For apartments, try to get more specific room details
    if (dbProperty.apartment_details) {
      // Bedrooms typically = total rooms - 1 (assuming living room)
      bedrooms = Math.max(1, (dbProperty.number_of_rooms || 2) - 1);
    }
    
    // For houses, use number of rooms as bedrooms
    if (dbProperty.house_details) {
      bedrooms = dbProperty.number_of_rooms || 2;
      bathrooms = Math.max(1, Math.floor(bedrooms / 2)); // Estimate bathrooms
    }
    
    return { bedrooms, bathrooms };
  }
  
  /**
   * Map database property category to frontend PropertyType
   */
  private static mapPropertyType(category?: string): PropertyType {
    if (!category) return 'APARTMENT';
    
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('apartament') || categoryLower.includes('apartment')) return 'APARTMENT';
    if (categoryLower.includes('casa') || categoryLower.includes('house')) return 'HOUSE';
    if (categoryLower.includes('teren') || categoryLower.includes('land')) return 'LAND';
    
    return 'OTHER_PROPERTY';
  }
  
  /**
   * Map database active status to frontend PropertyStatus
   */
  private static mapPropertyStatus(isActive?: boolean): PropertyStatus {
    return isActive !== false ? 'AVAILABLE' : 'UNAVAILABLE';
  }
  
  /**
   * Generate a description from available property data
   */
  private static generateDescription(dbProperty: any): string {
    const parts: string[] = [];
    
    if (dbProperty.property_category) {
      parts.push(`${dbProperty.property_category}`);
    }
    
    if (dbProperty.total_surface_area) {
      parts.push(`${dbProperty.total_surface_area}m²`);
    }
    
    if (dbProperty.number_of_rooms) {
      parts.push(`${dbProperty.number_of_rooms} rooms`);
    }
    
    if (dbProperty.construction_year) {
      parts.push(`built in ${dbProperty.construction_year}`);
    }
    
    if (dbProperty.city && dbProperty.county) {
      parts.push(`located in ${dbProperty.city}, ${dbProperty.county}`);
    }
    
    return parts.length > 0 
      ? `Property with ${parts.join(', ')}.`
      : 'Property details will be updated soon.';
  }
  
  /**
   * Determine if property should be marked as featured
   */
  private static determineFeaturedStatus(dbProperty: any): boolean {
    // Mark as featured if:
    // - Has images
    // - Has price prediction
    // - Has good accessibility score
    // - Is relatively new listing
    
    const hasImages = (dbProperty.image_count || 0) > 0;
    const hasPrediction = (dbProperty.ml_price_predictions?.length || 0) > 0;
    const goodAccessibility = (dbProperty.accessibility_score || 0) > 3;
    const isRecent = this.isRecentListing(dbProperty.date_created, 7); // 7 days
    
    const featuredScore = [hasImages, hasPrediction, goodAccessibility, isRecent]
      .filter(Boolean).length;
    
    return featuredScore >= 2; // At least 2 criteria met
  }
  
  /**
   * Check if property is a new listing (within last 30 days)
   */
  private static isNewListing(dateCreated?: string): boolean {
    return this.isRecentListing(dateCreated, 30);
  }
  
  /**
   * Check if listing is recent within specified days
   */
  private static isRecentListing(dateCreated?: string, days: number = 30): boolean {
    if (!dateCreated) return false;
    
    const listingDate = new Date(dateCreated);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return listingDate > cutoffDate;
  }
  
  /**
   * Get default image URL for properties without images
   */
  private static getDefaultImageUrl(): string {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';
  }
}

/**
 * Utility functions for property data validation
 */
export class PropertyValidationService {
  
  /**
   * Validate that a Property object has all required fields
   */
  static validateProperty(property: Property): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!property.id) errors.push('Property ID is required');
    if (!property.title) errors.push('Property title is required');
    if (!property.price || property.price <= 0) errors.push('Valid price is required');
    if (!property.surface || property.surface <= 0) errors.push('Valid surface area is required');
    if (!property.address) errors.push('Property address is required');
    if (!property.type) errors.push('Property type is required');
    if (!property.status) errors.push('Property status is required');
    if (!property.images || property.images.length === 0) errors.push('At least one image is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Sanitize property data for safe display
   */
  static sanitizeProperty(property: Property): Property {
    return {
      ...property,
      title: this.sanitizeString(property.title),
      address: this.sanitizeString(property.address),
      description: property.description ? this.sanitizeString(property.description) : undefined,
      tags: property.tags.map(tag => this.sanitizeString(tag)),
      price: Math.max(0, property.price),
      surface: Math.max(0, property.surface),
      bedrooms: Math.max(0, property.bedrooms),
      bathrooms: Math.max(0, property.bathrooms)
    };
  }
  
  private static sanitizeString(str: string): string {
    return str.trim().substring(0, 1000); // Limit length and trim whitespace
  }
}

export default PropertyTransformService; 