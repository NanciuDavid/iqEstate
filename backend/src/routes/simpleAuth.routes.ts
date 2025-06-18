/**
 * Simple Authentication Routes for EstateIQ Backend
 * 
 * Clean, simple JWT-based authentication routes without Passport.js
 * Compatible with the existing frontend API service expectations.
 */

import { Router, Request, Response } from 'express';
import { register, login, getUserById, updateUserProfile, RegisterData, LoginData } from '../services/authService';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    const userData: RegisterData = {
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    };

    const result = await register(userData);

    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Registration endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const loginData: LoginData = {
      email,
      password
    };

    const result = await login(loginData);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });
    } else {
      res.status(401).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Login endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/auth/profile
 * Get current user profile (requires authentication)
 */
router.get('/profile', authMiddleware as any, async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User information not found'
      });
      return;
    }

    // Get fresh user data from database
    const user = await getUserById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    console.error('Get profile endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile (requires authentication)
 */
router.put('/profile', authMiddleware as any, async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User information not found'
      });
      return;
    }

    const { firstName, lastName, phoneNumber } = req.body;
    
    const updateData: Partial<RegisterData> = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    const result = await updateUserProfile(req.user.id, updateData);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Update profile endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout endpoint (client-side token removal)
 */
router.post('/logout', (req: Request, res: Response): void => {
  // With JWT, logout is handled client-side by removing the token
  // This endpoint exists for compatibility and can be used for logging
  console.log('🔐 User logout request received');
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * GET /api/auth/verify
 * Verify token validity (requires authentication)
 */
router.get('/verify', authMiddleware as any, (req: any, res: Response): void => {
  // If middleware passes, token is valid
  res.status(200).json({
    success: true,
    data: { user: req.user },
    message: 'Token is valid'
  });
});

/**
 * GET /api/auth/debug
 * Debug endpoint to test token without authentication middleware
 */
router.get('/debug', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('🐛 Debug endpoint called:', {
    hasAuthHeader: !!authHeader,
    authHeader: authHeader ? authHeader.substring(0, 50) + '...' : 'None',
    tokenLength: token?.length,
    tokenPreview: token ? token.substring(0, 30) + '...' : 'No token'
  });

  if (!token) {
    res.status(400).json({
      success: false,
      error: 'No token provided in Authorization header',
      debug: {
        authHeader: authHeader || 'Missing',
        expectedFormat: 'Bearer <token>'
      }
    });
    return;
  }

  try {
    // Import verifyToken function directly to test it
    const { verifyToken } = require('../services/authService');
    const user = verifyToken(token);
    
    res.status(200).json({
      success: true,
      data: {
        tokenValid: !!user,
        user: user,
        tokenLength: token.length
      },
      message: 'Token debug complete'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Debug verification failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile using token data (faster than DB lookup)
 */
router.get('/me', authMiddleware as any, (req: any, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User information not found'
      });
      return;
    }

    // Return user data from token (no need for DB query)
    res.status(200).json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userType: req.user.userType,
        phoneNumber: req.user.phoneNumber,
        profilePictureUrl: req.user.profilePictureUrl,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt
      },
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router; 