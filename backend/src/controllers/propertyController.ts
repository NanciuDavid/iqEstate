import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

/**
 * PROPERTY CONTROLLER
 * 
 * This controller handles all property-related operations for EstateIQ:
 * - Getting all properties with filtering and pagination
 * - Getting a single property by ID
 * - Creating new properties (protected route)
 * - Updating properties (protected route)
 * - Deleting properties (protected route)
 * - Searching properties by geographic area
 * 
 * Each function includes detailed comments for beginners to understand
 * how database operations work with Prisma ORM.
 */

/**
 * GET /api/properties
 * 
 * Get all properties with pagination and optional filters
 * Optimized for performance with selective field loading
 */
export const getAllProperties = async (req: Request, res: Response): Promise<any> => {
  try {
    // Parse pagination parameters with defaults for better performance
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50); // Cap at 50 for performance
    const offset = (page - 1) * limit;

    // Parse optimization flags
    const includeImages = req.query.includeImages !== 'false';
    const includePredictions = req.query.includePredictions !== 'false';

    console.log(`📊 Fetching properties - Page: ${page}, Limit: ${limit}, Images: ${includeImages}, Predictions: ${includePredictions}`);

    // Build optimized include object based on request
    const includeConfig: any = {
      // Always include basic property details
      apartment_details: true,
      house_details: true,
    };

    // Conditionally include images
    if (includeImages) {
      includeConfig.property_images = {
        orderBy: [
          { is_primary: 'desc' },
          { sort_order: 'asc' }
        ],
        take: 3 // Limit to first 3 images for performance
      };
    }

    // Conditionally include ML predictions
    if (includePredictions) {
      includeConfig.ml_price_predictions = {
        orderBy: { prediction_date: 'desc' },
        take: 1
      };
    }

    // Conditionally include features (only if needed)
    if (req.query.includeFeatures === 'true') {
      includeConfig.property_to_feature_link = {
        include: {
          features_and_amenities: true
        }
      };
    }

    // Execute optimized query
    const properties = await prisma.properties.findMany({
      skip: offset,
      take: limit,
      include: includeConfig,
      orderBy: [
        { date_created: 'desc' }, // Most recent first
        { internal_property_id: 'desc' }
      ]
    });

    console.log(`✅ Found ${properties.length} properties from database`);

    // Transform properties for frontend with optimized data structure
    const transformedProperties = properties.map(property => {
      const baseProperty = {
        id: property.internal_property_id,
        title: property.title,
        price: property.price ? Number(property.price) : null,
        surface: property.total_surface_area ? Number(property.total_surface_area) : null,
        bedrooms: property.number_of_rooms,
        bathrooms: property.number_of_rooms, // Using rooms as proxy since bathrooms field doesn't exist
        address: property.address_text,
        city: property.city,
        county: property.county,
        latitude: property.latitude ? Number(property.latitude) : null,
        longitude: property.longitude ? Number(property.longitude) : null,
        type: property.property_category,
        yearBuilt: property.construction_year,
        listedDate: property.date_created,
        newListing: property.date_created ? 
          (new Date().getTime() - new Date(property.date_created).getTime()) < (7 * 24 * 60 * 60 * 1000) : false
      };

      // Add images only if requested
      if (includeImages && (property as any).property_images) {
        (baseProperty as any).images = (property as any).property_images.map((img: any) => img.image_url);
      }

      // Add predictions only if requested
      if (includePredictions && (property as any).ml_price_predictions && (property as any).ml_price_predictions.length > 0) {
        (baseProperty as any).predictedPrice = Number((property as any).ml_price_predictions[0].predicted_price);
      }

      return baseProperty;
    });

    return res.status(200).json({
      success: true,
      data: transformedProperties,
      pagination: {
        page,
        limit,
        total: properties.length,
        hasMore: properties.length === limit
      }
    });

  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching properties'
    });
  }
};

// GET /api/properties/:id - Get a single property by ID
export const getPropertyById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // Fetch the property with all related data
    const property = await prisma.properties.findUnique({
      where: {
        internal_property_id: id
      },
      include: {
        // Include all related data for detailed view
        property_images: {
          orderBy: { sort_order: 'asc' }
        },
        ml_price_predictions: {
          orderBy: { prediction_date: 'desc' },
          take: 1
        },
        apartment_details: true,
        house_details: true,
        property_to_feature_link: {
          include: {
            features_and_amenities: true
          }
        },
        countries: true
      }
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Transform data for frontend
    const transformedProperty = {
      id: property.internal_property_id,
      title: property.title,
      price: property.price ? Number(property.price) : null,
      predictedPrice: property.ml_price_predictions[0]?.predicted_price 
        ? Number(property.ml_price_predictions[0].predicted_price) 
        : null,
      surface: property.total_surface_area ? Number(property.total_surface_area) : null,
      bedrooms: property.number_of_rooms,
      bathrooms: null, // Add this field to your schema if needed
      address: property.address_text,
      city: property.city,
      county: property.county,
      latitude: property.latitude,
      longitude: property.longitude,
      type: property.property_category,
      yearBuilt: property.construction_year,
      description: property.raw_scraped_fields || 'No description available',
      images: property.property_images.map(img => img.image_url),
      features: property.property_to_feature_link.map(link => link.features_and_amenities.feature_name),
      listedDate: property.date_created,
      // Additional details based on property type
      details: property.apartment_details || property.house_details || null,
      // Prediction confidence if available
      predictionConfidence: property.ml_price_predictions[0]?.confidence_score 
        ? Number(property.ml_price_predictions[0].confidence_score) 
        : null
    };

    return res.status(200).json({
      success: true,
      data: transformedProperty
    });

  } catch (error) {
    console.error('Error fetching property:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching property'
    });
  }
};

// POST /api/properties/search-by-area - Search properties within a geographic area
export const searchPropertiesByArea = async (req: Request, res: Response): Promise<any> => {
  try {
    const { coordinates, filters = {} } = req.body;

    // Validate coordinates array
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates. Please provide at least 3 coordinate pairs for area search.'
      });
    }

    // For simplicity, we'll use a bounding box approach
    // In a production app, you'd want to use PostGIS for proper polygon queries
    const latitudes = coordinates.map((coord: any) => coord.lat);
    const longitudes = coordinates.map((coord: any) => coord.lng);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // Build search query
    const searchFilters: any = {
      is_active_on_source: true,
      latitude: {
        gte: minLat,
        lte: maxLat
      },
      longitude: {
        gte: minLng,
        lte: maxLng
      }
    };

    // Apply additional filters if provided
    if (filters.type) searchFilters.property_category = filters.type;
    if (filters.minPrice) {
      searchFilters.price = { ...searchFilters.price, gte: filters.minPrice };
    }
    if (filters.maxPrice) {
      searchFilters.price = { ...searchFilters.price, lte: filters.maxPrice };
    }

    const properties = await prisma.properties.findMany({
      where: searchFilters,
      include: {
        property_images: {
          orderBy: [
            { is_primary: 'desc' },
            { sort_order: 'asc' }
          ]
        },
        ml_price_predictions: {
          orderBy: { prediction_date: 'desc' },
          take: 1
        },
        property_to_feature_link: {
          include: {
            features_and_amenities: true
          }
        },
        apartment_details: true,
        house_details: true
      },
      take: 50 // Limit results for performance
    });

    // Return the properties in the same format as getAllProperties for consistency
    // This allows the frontend PropertyTransformService to handle the data properly
    const transformedProperties = properties.map(property => ({
      internal_property_id: property.internal_property_id,
      title: property.title,
      price: property.price ? Number(property.price) : null,
      predictedPrice: property.ml_price_predictions[0]?.predicted_price 
        ? Number(property.ml_price_predictions[0].predicted_price) 
        : null,
      total_surface_area: property.total_surface_area,
      number_of_rooms: property.number_of_rooms,
      latitude: property.latitude,
      longitude: property.longitude,
      address_text: property.address_text,
      city: property.city,
      county: property.county,
      property_category: property.property_category,
      construction_year: property.construction_year,
      date_created: property.date_created,
      is_active_on_source: property.is_active_on_source,
      image_count: property.image_count,
      accessibility_score: property.accessibility_score,
      property_images: property.property_images,
      ml_price_predictions: property.ml_price_predictions,
      property_to_feature_link: property.property_to_feature_link,
      apartment_details: property.apartment_details,
      house_details: property.house_details
    }));

    return res.status(200).json({
      success: true,
      data: transformedProperties,
      searchArea: {
        bounds: {
          north: maxLat,
          south: minLat,
          east: maxLng,
          west: minLng
        }
      }
    });

  } catch (error) {
    console.error('Error searching properties by area:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while searching properties'
    });
  }
};

// POST /api/properties - Create a new property (Protected route)
export const createProperty = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    // This would be used by admins or property owners to add new listings
    // For now, this is a placeholder - you'd implement this based on your needs
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Implement property creation logic here
    return res.status(501).json({
      success: false,
      message: 'Property creation not yet implemented'
    });

  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating property'
    });
  }
};

// PUT /api/properties/:id - Update a property (Protected route)
export const updateProperty = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    // This would be used to update existing property information
    // For now, this is a placeholder
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    return res.status(501).json({
      success: false,
      message: 'Property update not yet implemented'
    });

  } catch (error) {
    console.error('Error updating property:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating property'
    });
  }
};

// DELETE /api/properties/:id - Delete a property (Protected route)
export const deleteProperty = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    // This would be used to delete/deactivate property listings
    // For now, this is a placeholder
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    return res.status(501).json({
      success: false,
      message: 'Property deletion not yet implemented'
    });

  } catch (error) {
    console.error('Error deleting property:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting property'
    });
  }
}; 