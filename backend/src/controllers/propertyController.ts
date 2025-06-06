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

// GET /api/properties - Get all properties with optional filtering and pagination
export const getAllProperties = async (req: Request, res: Response): Promise<any> => {
  try {
    // Extract query parameters for filtering and pagination
    const {
      page = 1,           // Current page number (default: 1)
      limit = 12,         // Number of properties per page (default: 12)
      type,              // Property type filter (apartment, house, etc.)
      minPrice,          // Minimum price filter
      maxPrice,          // Maximum price filter
      city,              // City filter
      minRooms,          // Minimum number of rooms
      maxRooms,          // Maximum number of rooms
      featured,          // Show only featured properties
      sortBy = 'date_created', // Sort field
      sortOrder = 'desc'       // Sort order (asc/desc)
    } = req.query;

    // Convert page and limit to numbers for pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum; // Calculate how many records to skip

    // Build the filter object based on query parameters
    // This is where we dynamically build the database query
    const filters: any = {
      is_active_on_source: true, // Only show active listings
    };

    // Add filters only if they are provided in the request
    if (type) {
      filters.property_category = type;
    }

    if (city) {
      // Case-insensitive city search
      filters.city = {
        contains: city as string,
        mode: 'insensitive'
      };
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice as string); // Greater than or equal
      if (maxPrice) filters.price.lte = parseFloat(maxPrice as string); // Less than or equal
    }

    // Room count filtering
    if (minRooms || maxRooms) {
      filters.number_of_rooms = {};
      if (minRooms) filters.number_of_rooms.gte = parseInt(minRooms as string);
      if (maxRooms) filters.number_of_rooms.lte = parseInt(maxRooms as string);
    }

    // If featured flag is set, only show featured properties
    if (featured === 'true') {
      // Note: Your schema doesn't have a featured field, so we'll use a workaround
      // You might want to add this field to your properties model later
      filters.listing_type = 'SALE'; // For now, let's use this as a proxy
    }

    // Build sort object
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder as string;

    // Execute the database query with Prisma
    // This fetches properties with all the filters applied
    const properties = await prisma.properties.findMany({
      where: filters,
      include: {
        // Include related data that the frontend might need
        property_images: {
          where: { is_primary: true }, // Only get the primary image for list view
          take: 1
        },
        ml_price_predictions: {
          orderBy: { prediction_date: 'desc' },
          take: 1 // Get the latest price prediction
        }
      },
      skip,           // Skip records for pagination
      take: limitNum, // Limit results
      orderBy
    });

    // Get total count for pagination metadata
    const totalCount = await prisma.properties.count({
      where: filters
    });

    // Transform the data to match your frontend expectations
    const transformedProperties = properties.map(property => ({
      id: property.internal_property_id,
      title: property.title,
      price: property.price ? Number(property.price) : null,
      predictedPrice: property.ml_price_predictions[0]?.predicted_price 
        ? Number(property.ml_price_predictions[0].predicted_price) 
        : null,
      surface: property.total_surface_area ? Number(property.total_surface_area) : null,
      bedrooms: property.number_of_rooms,
      bathrooms: null, // Your schema doesn't separate bathrooms, you might add this
      address: property.address_text,
      city: property.city,
      county: property.county,
      latitude: property.latitude,
      longitude: property.longitude,
      type: property.property_category,
      yearBuilt: property.construction_year,
      images: property.property_images.map(img => img.image_url),
      listedDate: property.date_created,
      featured: false, // You can implement this logic based on your business rules
      newListing: property.date_created ? 
        (new Date().getTime() - new Date(property.date_created).getTime()) < (7 * 24 * 60 * 60 * 1000) : false
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPreviousPage = pageNum > 1;

    // Send successful response with properties and pagination info
    return res.status(200).json({
      success: true,
      data: transformedProperties,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        limit: limitNum
      }
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
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
          where: { is_primary: true },
          take: 1
        },
        ml_price_predictions: {
          orderBy: { prediction_date: 'desc' },
          take: 1
        }
      },
      take: 50 // Limit results for performance
    });

    const transformedProperties = properties.map(property => ({
      id: property.internal_property_id,
      title: property.title,
      price: property.price ? Number(property.price) : null,
      predictedPrice: property.ml_price_predictions[0]?.predicted_price 
        ? Number(property.ml_price_predictions[0].predicted_price) 
        : null,
      latitude: property.latitude,
      longitude: property.longitude,
      address: property.address_text,
      type: property.property_category,
      image: property.property_images[0]?.image_url || null
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