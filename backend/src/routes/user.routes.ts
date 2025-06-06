import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  updateFavoriteNotes
} from '../controllers/userController';

const router = Router();

/**
 * USER ROUTES
 * 
 * These routes handle user-related operations:
 * - Profile management
 * - Password changes
 * - Favorites/saved properties management
 * 
 * All routes require authentication since they deal with
 * user-specific data and operations.
 */

// All user routes require authentication
router.use(verifyToken);

// Profile Management Routes

// GET /api/users/profile - Get current user's profile information
router.get('/profile', getUserProfile);

// PUT /api/users/profile - Update user profile information
// Expects: firstName, lastName, phoneNumber, profilePictureUrl in request body
router.put('/profile', updateUserProfile);

// POST /api/users/change-password - Change user password
// Expects: currentPassword, newPassword, confirmPassword in request body
router.post('/change-password', changePassword);

// Favorites Management Routes

// GET /api/users/favorites - Get user's favorite/saved properties
router.get('/favorites', getUserFavorites);

// POST /api/users/favorites/:propertyId - Add property to favorites
// Optional: notes in request body
router.post('/favorites/:propertyId', addToFavorites);

// DELETE /api/users/favorites/:propertyId - Remove property from favorites
router.delete('/favorites/:propertyId', removeFromFavorites);

// PUT /api/users/favorites/:propertyId/notes - Update notes for a favorite property
// Expects: notes in request body
router.put('/favorites/:propertyId/notes', updateFavoriteNotes);

export default router; 