import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import {
  getAllProperties,
  getPropertyById,
  searchPropertiesByArea,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController';

const router = Router();

/**
 * PROPERTY ROUTES
 * 
 * These routes handle all property-related operations:
 * - Public routes: viewing properties, searching
 * - Protected routes: creating, updating, deleting properties
 * 
 * The routes follow RESTful conventions:
 * GET /properties - List all properties with filtering/pagination
 * GET /properties/:id - Get single property
 * POST /properties - Create new property (protected)
 * PUT /properties/:id - Update property (protected)
 * DELETE /properties/:id - Delete property (protected)
 * POST /properties/search-by-area - Search by geographic area
 */

// Public routes (no authentication required)

// GET /api/properties - Get all properties with filtering and pagination
// Example: /api/properties?page=1&limit=12&type=apartment&city=București&minPrice=50000&maxPrice=200000
router.get('/', getAllProperties);

// GET /api/properties/:id - Get single property by ID
router.get('/:id', getPropertyById);

// POST /api/properties/search-by-area - Search properties within a geographic area
// This route expects coordinates array in the request body
router.post('/search-by-area', searchPropertiesByArea);

// Protected routes (authentication required)

// POST /api/properties - Create a new property listing
// Requires authentication - only logged-in users can create properties
router.post('/', verifyToken, createProperty);

// PUT /api/properties/:id - Update an existing property
// Requires authentication - only the owner or admin can update
router.put('/:id', verifyToken, updateProperty);

// DELETE /api/properties/:id - Delete/deactivate a property
// Requires authentication - only the owner or admin can delete
router.delete('/:id', verifyToken, deleteProperty);

export default router; 