import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

/**
 * USER CONTROLLER
 * 
 * This controller handles user-related operations for EstateIQ:
 * - Getting user profile information
 * - Updating user profile
 * - Managing user favorites/saved properties
 * - User preferences and settings
 * 
 * All routes in this controller require authentication.
 */

// GET /api/users/profile - Get current user's profile
export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    console.log('🔐 User Controller - getUserProfile called:', {
      hasUser: !!req.user,
      userId: req.user?.id,
      userEmail: req.user?.email
    });

    if (!req.user) {
      console.log('🔐 User Controller - No user in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Fetch complete user information from database
    const user = await prisma.users.findUnique({
      where: {
        user_id: req.user.id
      },
      // Don't include password_hash in the response for security
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        user_type: true,
        profile_picture_url: true,
        is_verified: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      console.log('🔐 User Controller - User not found in database:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('🔐 User Controller - Profile found successfully:', {
      userId: user.user_id,
      email: user.email
    });

    // Transform the data for frontend consumption
    const userProfile = {
      id: user.user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      userType: user.user_type,
      profilePictureUrl: user.profile_picture_url,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };

    return res.status(200).json({
      success: true,
      data: userProfile
    });

  } catch (error) {
    console.error('🔐 Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching profile'
    });
  }
};

// PUT /api/users/profile - Update user profile
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { firstName, lastName, phoneNumber, profilePictureUrl } = req.body;

    // Validate input data
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      });
    }

    // Check if phone number is already taken by another user
    if (phoneNumber) {
      const existingUser = await prisma.users.findFirst({
        where: {
          phone_number: phoneNumber,
          user_id: { not: req.user.id }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is already in use by another account'
        });
      }
    }

    // Update user in database
    const updatedUser = await prisma.users.update({
      where: {
        user_id: req.user.id
      },
      data: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        profile_picture_url: profilePictureUrl,
        updated_at: new Date()
      },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        user_type: true,
        profile_picture_url: true,
        is_verified: true,
        created_at: true,
        updated_at: true
      }
    });

    // Transform response
    const userProfile = {
      id: updatedUser.user_id,
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      phoneNumber: updatedUser.phone_number,
      userType: updatedUser.user_type,
      profilePictureUrl: updatedUser.profile_picture_url,
      isVerified: updatedUser.is_verified,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at
    };

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userProfile
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile'
    });
  }
};

// POST /api/users/change-password - Change user password
export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Get current user with password hash
    const user = await prisma.users.findUnique({
      where: {
        user_id: req.user.id
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password in database
    await prisma.users.update({
      where: {
        user_id: req.user.id
      },
      data: {
        password_hash: hashedNewPassword,
        updated_at: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while changing password'
    });
  }
};

// GET /api/users/favorites - Get user's favorite properties
export const getUserFavorites = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.user || !req.user.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user's saved listings with property details
    const savedListings = await prisma.user_saved_listings.findMany({
      where: {
        user_id: req.user.user.id
      },
      include: {
        properties: {
          include: {
            property_images: {
              where: { is_primary: true },
              take: 1
            },
            ml_price_predictions: {
              orderBy: { prediction_date: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: {
        date_saved: 'desc'
      }
    });

    // Transform data for frontend
    const favorites = savedListings.map(listing => ({
      id: listing.property_id,
      title: listing.properties.title,
      price: listing.properties.price ? Number(listing.properties.price) : null,
      predictedPrice: listing.properties.ml_price_predictions[0]?.predicted_price 
        ? Number(listing.properties.ml_price_predictions[0].predicted_price) 
        : null,
      surface: listing.properties.total_surface_area ? Number(listing.properties.total_surface_area) : null,
      bedrooms: listing.properties.number_of_rooms,
      address: listing.properties.address_text,
      city: listing.properties.city,
      type: listing.properties.property_category,
      image: listing.properties.property_images[0]?.image_url || null,
      dateSaved: listing.date_saved,
      notes: listing.notes
    }));

    return res.status(200).json({
      success: true,
      data: favorites
    });

  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching favorites'
    });
  }
};

// POST /api/users/favorites/:propertyId - Add property to favorites
export const addToFavorites = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.user || !req.user.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { propertyId } = req.params;
    const { notes } = req.body;

    // Check if property exists
    const property = await prisma.properties.findUnique({
      where: {
        internal_property_id: propertyId
      }
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if already in favorites
    const existingFavorite = await prisma.user_saved_listings.findUnique({
      where: {
        user_id_property_id: {
          user_id: req.user.user.id,
          property_id: propertyId
        }
      }
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Property is already in your favorites'
      });
    }

    // Add to favorites
    await prisma.user_saved_listings.create({
      data: {
        user_id: req.user.user.id,
        property_id: propertyId,
        notes: notes || null,
        date_saved: new Date()
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Property added to favorites successfully'
    });

  } catch (error) {
    console.error('Error adding to favorites:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while adding to favorites'
    });
  }
};

// DELETE /api/users/favorites/:propertyId - Remove property from favorites
export const removeFromFavorites = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.user || !req.user.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { propertyId } = req.params;

    // Check if the favorite exists
    const existingFavorite = await prisma.user_saved_listings.findUnique({
      where: {
        user_id_property_id: {
          user_id: req.user.user.id,
          property_id: propertyId
        }
      }
    });

    if (!existingFavorite) {
      return res.status(404).json({
        success: false,
        message: 'Property not found in your favorites'
      });
    }

    // Remove from favorites
    await prisma.user_saved_listings.delete({
      where: {
        user_id_property_id: {
          user_id: req.user.user.id,
          property_id: propertyId
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Property removed from favorites successfully'
    });

  } catch (error) {
    console.error('Error removing from favorites:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while removing from favorites'
    });
  }
};

// PUT /api/users/favorites/:propertyId/notes - Update notes for a favorite property
export const updateFavoriteNotes = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.user || !req.user.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { propertyId } = req.params;
    const { notes } = req.body;

    // Check if the favorite exists
    const existingFavorite = await prisma.user_saved_listings.findUnique({
      where: {
        user_id_property_id: {
          user_id: req.user.user.id,
          property_id: propertyId
        }
      }
    });

    if (!existingFavorite) {
      return res.status(404).json({
        success: false,
        message: 'Property not found in your favorites'
      });
    }

    // Update notes
    await prisma.user_saved_listings.update({
      where: {
        user_id_property_id: {
          user_id: req.user.user.id,
          property_id: propertyId
        }
      },
      data: {
        notes: notes || null
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Notes updated successfully'
    });

  } catch (error) {
    console.error('Error updating favorite notes:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating notes'
    });
  }

  
}; 

export const checkFavoriteStatus = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { propertyId } = req.params;
    
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const favorite = await prisma.user_favorites.findUnique({
      where: {
        user_id_property_id: {
          user_id: req.user.id,
          property_id: propertyId
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: { isFavorite: !!favorite }
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};