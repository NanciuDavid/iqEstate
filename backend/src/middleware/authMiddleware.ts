/**
 * Simple JWT Authentication Middleware for EstateIQ Backend
 * 
 * This middleware validates JWT tokens and adds user information to the request object.
 * Compatible with the new AuthService and frontend API expectations.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken as verifyAuthToken, AuthUser } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

/**
 * Middleware to verify JWT token and extract user information
 */
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  console.log('🔐 Auth Middleware - Token verification:', {
    hasAuthHeader: !!authHeader,
    tokenLength: token?.length,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'No token',
    endpoint: req.path,
    method: req.method
  });

  if (!token) {
    console.log('🔐 Auth Middleware - No token provided');
    res.status(401).json({ 
      success: false,
      error: 'Access denied. No token provided.' 
    });
    return;
  }

  try {
    console.log('🔐 Auth Middleware - Attempting to verify token with length:', token.length);
    const user = verifyAuthToken(token);
    
    if (!user) {
      console.log('🔐 Auth Middleware - Token verification returned null/undefined');
      res.status(401).json({ 
        success: false,
        error: 'Invalid or expired token.' 
      });
      return;
    }

    console.log('🔐 Auth Middleware - Token verified successfully:', {
      userId: user.id,
      email: user.email,
      userType: user.userType,
      isVerified: user.isVerified
    });

    req.user = user;
    next();
  } catch (error) {
    console.error('🔐 Auth Middleware - Token verification error:', {
      error: error instanceof Error ? error.message : String(error),
      tokenPreview: token.substring(0, 30) + '...'
    });
    res.status(401).json({ 
      success: false,
      error: 'Token verification failed.' 
    });
    return;
  }
};

/**
 * Legacy middleware for backward compatibility
 * @deprecated Use authMiddleware instead
 */
export const verifyToken = authMiddleware;