/**
 * Simple JWT Authentication Service for EstateIQ Backend
 * 
 * This service provides clean, simple JWT-based authentication without Passport.js
 * Features:
 * - User registration with email/password
 * - User login with JWT token generation
 * - Password hashing with bcryptjs
 * - Token validation and user extraction
 * - Compatible with existing frontend API service
 */

import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d'; // Fixed: Use string format directly

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// User types
export enum UserType {
  USER = 'user',
  ADMIN = 'admin'
}

// Interfaces
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: UserType;
  profilePictureUrl: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: AuthUser;
    token: string;
  };
  message?: string;
  error?: string;
}

/**
 * Hash password using bcryptjs
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token with user data
 */
export const generateToken = (user: AuthUser): string => {
  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    userType: user.userType,
    profilePictureUrl: user.profilePictureUrl,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN
  };

  return jwt.sign(payload, JWT_SECRET as string, options);
};

/**
 * Verify JWT token and extract user data
 */
export const verifyToken = (token: string): AuthUser | null => {
  try {
    console.log('🔐 AuthService - Verifying token:', {
      tokenLength: token.length,
      tokenStart: token.substring(0, 50) + '...',
      jwtSecretLength: JWT_SECRET?.length
    });

    const decoded = jwt.verify(token, JWT_SECRET!) as any;
    
    console.log('🔐 AuthService - Token decoded successfully:', {
      hasId: !!decoded.id,
      hasEmail: !!decoded.email,
      exp: decoded.exp,
      iat: decoded.iat,
      expiryDate: decoded.exp ? new Date(decoded.exp * 1000) : 'No expiry',
      currentTime: new Date(),
      isExpired: decoded.exp ? (decoded.exp * 1000 <= Date.now()) : 'Unknown'
    });

    // Validate required fields
    if (!decoded.id || !decoded.email) {
      console.error('🔐 AuthService - Token missing required fields:', {
        hasId: !!decoded.id,
        hasEmail: !!decoded.email
      });
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName || '',
      lastName: decoded.lastName || '',
      phoneNumber: decoded.phoneNumber || '',
      userType: decoded.userType || UserType.USER,
      profilePictureUrl: decoded.profilePictureUrl || '',
      isVerified: decoded.isVerified || false,
      createdAt: decoded.createdAt || '',
      updatedAt: decoded.updatedAt || ''
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('🔐 AuthService - Token expired:', {
        expiredAt: error.expiredAt,
        currentTime: new Date()
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('🔐 AuthService - Invalid token format:', error.message);
    } else {
      console.error('🔐 AuthService - Token verification error:', error);
    }
    return null;
  }
};

/**
 * Convert database user to AuthUser format
 */
const formatUser = (dbUser: any): AuthUser => {
  return {
    id: dbUser.user_id,
    email: dbUser.email,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    phoneNumber: dbUser.phone_number,
    userType: dbUser.user_type as UserType,
    profilePictureUrl: dbUser.profile_picture_url,
    isVerified: dbUser.is_verified,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at
  };
};

/**
 * Register a new user
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = userData;

    // Validation
    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      return {
        success: false,
        error: 'All fields are required'
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long'
      };
    }

    // Check if email already exists
    const existingUserByEmail = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }

    // Check if phone number already exists
    const existingUserByPhone = await prisma.users.findFirst({
      where: { phone_number: phoneNumber }
    });

    if (existingUserByPhone) {
      return {
        success: false,
        error: 'Phone number already registered'
      };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const now = new Date();
    const userId = randomUUID();

    const newUser = await prisma.users.create({
      data: {
        user_id: userId,
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        user_type: UserType.USER,
        profile_picture_url: 'https://images.unsplash.com/photo-2472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        is_verified: false,
        created_at: now,
        updated_at: now
      }
    });

    // Format user and generate token
    const user = formatUser(newUser);
    const token = generateToken(user);

    return {
      success: true,
      data: { user, token },
      message: 'User registered successfully'
    };

  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Registration failed. Please try again.'
    };
  }
};

/**
 * Login user with email and password
 */
export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const { email, password } = loginData;

    // Validation
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Format user and generate token
    const authUser = formatUser(user);
    const token = generateToken(authUser);

    return {
      success: true,
      data: { user: authUser, token },
      message: 'Login successful'
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login failed. Please try again.'
    };
  }
};

/**
 * Get user by ID from database
 */
export const getUserById = async (userId: string): Promise<AuthUser | null> => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId }
    });

    if (!user) {
      return null;
    }

    return formatUser(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, updateData: Partial<RegisterData>): Promise<AuthResponse> => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: userId }
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Prepare update data
    const updates: any = {
      updated_at: new Date()
    };

    if (updateData.firstName) updates.first_name = updateData.firstName;
    if (updateData.lastName) updates.last_name = updateData.lastName;
    if (updateData.phoneNumber) {
      // Check if phone number is already taken by another user
      const existingUser = await prisma.users.findFirst({
        where: {
          phone_number: updateData.phoneNumber,
          user_id: { not: userId }
        }
      });

      if (existingUser) {
        return {
          success: false,
          error: 'Phone number already in use'
        };
      }

      updates.phone_number = updateData.phoneNumber;
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: updates
    });

    const authUser = formatUser(updatedUser);
    const token = generateToken(authUser);

    return {
      success: true,
      data: { user: authUser, token },
      message: 'Profile updated successfully'
    };

  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: 'Failed to update profile'
    };
  }
}; 